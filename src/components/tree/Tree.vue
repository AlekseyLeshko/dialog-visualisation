<template>

  <div 
  	class="viewport treeclass" 
  	v-resize="resize">
  </div>

</template>


<script>
	
import resize from 'vue-resize-directive'
import euclidean from './euclidean-layout'
import circular from './circular-layout'
import {compareString, anchorTodx, drawLink, toPromise, findInParents, mapMany, translate} from './d3-utils'

import * as d3 from 'd3'

const layout = {
  euclidean,
  circular
}

var i = 0
var currentSelected = null
const types = ['tree', 'cluster']
const layouts = ['circular', 'euclidean']

const props = {
  data: Object,
  duration: {
    type: Number,
    default: 750
  },
  type: {
    type: String,
    default: 'tree',
    validator (value) {
      return types.indexOf(value) !== -1
    }
  },
  layoutType: {
    type: String,
    default: 'euclidean',
    validator (value) {
      return layouts.indexOf(value) !== -1
    }
  },
	fontSize: {
		type: Number,
		default: 14
	},
  marginX: {
    type: Number,
    default: 20
  },
  marginY: {
    type: Number,
    default: 20
  },
  nodeText: {
    type: String,
    required: true
  },
  identifier: {
    type: Function,
    default: () => i++
  },
  zoomable: {
    type: Boolean,
    default: false
  },
  radius: {
    type: Number,
    default: 3
  }
}

const directives = {
  resize
}

function hasChildren (d) {
  return d.children || d._children;
}

function getChildren (d) {
  return d.children ? {children: d.children, visible: true} : (d._children ? {children: d._children, visible: false} : null);
}

function onAllChilddren (d, callback, fatherVisible = undefined) {
  if (callback(d, fatherVisible) === false) {
    return;
  }
  var directChildren = getChildren(d);
  directChildren && directChildren.children.forEach(child => onAllChilddren(child, callback, directChildren.visible));
}

export default {
  name: 'D3Tree',

  props,

  directives,

  data () {
    return {
      currentTransform: null,
      maxTextLenght: {
        first: 0,
        last: 0
      }
    }
  },
	
	created () {
		
		
	},

  mounted () {
    const size = this.getSize();
    const svg = d3.select(this.$el)
					.append('svg')
          .attr('width', size.width)
          .attr('height', size.height);
		
    let g = null,
				zoom = null,
				g_links = null;

    if (this.zoomable) {
      g = svg.append('g');
      zoom = d3.zoom().scaleExtent([0.9, 8]).on('zoom', this.zoomed(g));
      svg.call(zoom).on('wheel', () => d3.event.preventDefault());
      svg.call(zoom.transform, d3.zoomIdentity);
    } else {
      g = this.transformSvg(svg.append('g'), size);
    }
		
		g_links = g.append('g').attr('class', 'links-group');

    const tree = this.tree;
    this.internaldata = {
      svg,
      g,
			g_links,
      tree,
      zoom
    }

    this.data && this.onData(this.data);
		
		this.collapseAll(this.internaldata.root);
  },

  methods: {
    getSize () {
      let width = this.$el.clientWidth,
					height = this.$el.clientHeight;
      return { width, height };
    },

    resize () {
      const size = this.getSize()
      this.internaldata.svg
              .attr('width', size.width)
              .attr('height', size.height);
      this.layout.size(this.internaldata.tree, size, this.margin, this.maxTextLenght);
      this.applyZoom(size);
      this.redraw();
			
			this.$emit('resized', size);
    },

    completeRedraw ({margin = null, layout = null}) {
      const size = this.getSize();
      this.layout.size(this.internaldata.tree, size, this.margin, this.maxTextLenght);
      this.applyTransition(size, {margin, layout});
      this.redraw();
    },

    transformSvg (g, size) {
      size = size || this.getSize();
      return this.layout.transformSvg(g, this.margin, size, this.maxTextLenght);
    },

    updateTransform (g, size) {
      size = size || this.getSize();
      return this.layout.updateTransform(g, this.margin, size, this.maxTextLenght);
    },

    updateGraph (source) {
			
      source = source || this.internaldata.root;
      let originBuilder = source;
      let forExit = source;
      const origin = {
				x: source.x0, 
				y: source.y0
			};

      if (arguments.length === 0) {
        originBuilder = d => {
          if (d.parent == null) {
            return origin;
          }
          if (d.parent.x0 !== undefined) {
            return {x: d.parent.x0, y: d.parent.y0};
          }
          if (d.parent._x0 !== undefined) {
            return {x: d.parent._x0, y: d.parent._y0};
          }
          return origin;
        }
        forExit = d => ({x: source.x, y: source.y});
        source = this.internaldata.root;
      } else if (typeof source === 'object') {
        originBuilder = d => origin;
        forExit = d => ({x: source.x, y: source.y});
      }

      const root = this.internaldata.root;
      const links = this.internaldata.g_links
				.selectAll('.linktree')
				.data(this.internaldata.tree(root).descendants().slice(1), d => d.id);

      const updateLinks = links.enter()
				.append('path')
				.attr('class', 'linktree')
				.attr('data-name', d => d.data.name.replace('(loop)', '').trim().replace(/\s/g, '-').replace(/[\[\]\.]+/g, '_') + '_' + d.id)
				.attr('data-parent-name', d => source.data.name.replace('(loop)', '').trim().replace(/\s/g, '-').replace(/[\[\]\.]+/g, '_') + '_' + source.id)
				.attr('data-type', d => d.data.circle);
			
      const nodes = this.internaldata.g
				.selectAll('.nodetree')
				.data(root.descendants(), d => d.id);
			
      const newNodes = nodes.enter()
				.append('g')
				.attr('class', 'nodetree')
				.attr('data-name', d => d.data.name.replace('(loop)', '').trim().replace(/\s/g, '-').replace(/[\[\]\.]+/g, '_') + '_' + d.id)
				.attr('data-parent-name', d => source.data.name.replace('(loop)', '').trim().replace(/\s/g, '-').replace(/[\[\]\.]+/g, '_') + '_' + source.id)
				.attr('data-id', d => d.id)
				.attr('data-type', d => d.data.circle);
			
      const allNodes = newNodes.merge(nodes);

      nodes.each(function (d) {
        d._x0 = d.x
        d._y0 = d.y
      });

      newNodes.append('text')
				.attr('class','node_name')
        .attr('dy', -10 / this.currentTransform.k)
        .attr('x', 0)
        .attr('dx', 0)
        .attr('transform', 'rotate(0)')
				.attr('style', 'font-size:' + (this.fontSize / this.currentTransform.k) + 'px' ) 
        .on('click', d => {
          currentSelected = (currentSelected === d) ? null : d;
          d3.event.stopPropagation();
          this.redraw();
          this.$emit('clicked', {element: d, data: d.data});
        })
				.on('mouseenter', d => {
					currentSelected = (currentSelected === d) ? null : d;
          //d3.event.stopPropagation();
					this.$emit('mouseentered', {element: d, data: d.data});
				});
			
			newNodes.append('text')
				.attr('class','node_value')	
        .attr('dy', 20 / this.currentTransform.k)
        .attr('x', 0)
        .attr('dx', 0)
        .attr('transform', 'rotate(0)')
				.attr('style', 'font-size:' + (this.fontSize / this.currentTransform.k) + 'px' ) 

			
			
			
      updateLinks.attr('d', d => drawLink(originBuilder(d), originBuilder(d), this.layout))
				.classed('type_t', d => d.data.circle === 'T' )
				.classed('type_l', d => d.data.circle === 'L' )
				.classed('type_s', d => d.data.circle === 'S' )
				.classed('type_w', d => d.data.circle === 'W' )
				.classed('type_d', d => d.data.circle === 'D' )
				.classed('type_a', d => d.data.circle === 'A' )
			
      const updateAndNewLinks = links.merge(updateLinks);
			
      const updateAndNewLinksPromise = toPromise(updateAndNewLinks.transition().duration(this.duration)
						.attr('d', d => drawLink(d, d.parent, this.layout)));
			
      const exitingLinksPromise = toPromise(links.exit().transition().duration(this.duration).attr('d', d => drawLink(forExit(d), forExit(d), this.layout)).remove());

      newNodes.attr('transform', d => translate(originBuilder(d), this.layout))
        .append('circle')
        .attr('r', this.radius / this.currentTransform.k );
			
			

      allNodes.classed('node__internal', d => hasChildren(d))
        .classed('node--leaf', d => !hasChildren(d))
        .classed('selected', d => d === currentSelected)
				.classed('type_t', d => d.data.circle === 'T' )
				.classed('type_l', d => d.data.circle === 'L' )
				.classed('type_s', d => d.data.circle === 'S' )
				.classed('type_w', d => d.data.circle === 'W' )
				.classed('type_d', d => d.data.circle === 'D' )
				.classed('type_a', d => d.data.circle === 'A' )
        .on('click', this.onNodeClick);

      const allNodesPromise = toPromise(allNodes.transition().duration(this.duration)
        .attr('transform', d => translate(d, this.layout))
        .attr('opacity', 1));

      const text = allNodes.select('.node_name').text(d => {
				return d.data.name;//d.data[this.nodeText]
			});
			const description = allNodes.select('.node_value').text(d => {
				return d.data.value || '';
			});

      const {transformText} = this.layout
      allNodes.each((d,e) => {
        d.textInfo = transformText(d, hasChildren(d))
      });
			
			

      const textTransition = toPromise(text.transition().duration(this.duration)
          .attr('transform', d => `rotate(${d.textInfo.rotate})`));

      allNodes.each((d) => {
        d.x0 = d.x
        d.y0 = d.y
      })

      const exitingNodes = nodes.exit();
      const exitingNodesPromise = toPromise(exitingNodes.transition().duration(this.duration)
                  .attr('transform', d => translate(forExit(d), this.layout))
                  .attr('opacity', 0).remove());
			
      exitingNodes.select('circle').attr('r', 1e-6);

      const leaves = root.leaves();
      const extremeNodes = text.filter(d => leaves.indexOf(d) !== -1).nodes();
      const last = Math.max(...extremeNodes.map(node => node.getComputedTextLength())) + 6;
      const first = text.node().getComputedTextLength() + 6;
      if (last <= this.maxTextLenght.last && first <= this.maxTextLenght.first) {
        return Promise.all([allNodesPromise, exitingNodesPromise, textTransition, updateAndNewLinksPromise, exitingLinksPromise]);
      }

      this.maxTextLenght = {first, last}
      const size = this.getSize();
			
      if (this.zoomable) {
        this.internaldata.svg.call(this.internaldata.zoom.transform, this.currentTransform);
      } else {
        const {g} = this.internaldata;
        this.transformSvg(g, size);
      }
      this.layout.size(this.internaldata.tree, size, this.margin, this.maxTextLenght);
      return this.updateGraph(source);
    },

    onNodeClick (d) {
			
      if (d.children) {
        this.collapse(d);
      } else {
        this.expand(d);
      }
    },

    onData (data) {
      if (!data) {
        this.internaldata.root = null;
        this.clean();
        return;
      }
      const root = d3.hierarchy(data).sort((a, b) => { return compareString(a.data.text, b.data.text) })
      this.internaldata.root = root
      root.each(d => { d.id = this.identifier(d.data) })
      const size = this.getSize()
      root.x = size.height / 2
      root.y = 0
      root.x0 = root.x
      root.y0 = root.y
      //this.redraw()
    },

    clean () {
      ['.linktree', '.nodetree', 'text', 'circle'].forEach(selector => {
        this.internaldata.g.selectAll(selector).transition().duration(this.duration).attr('opacity', 0).remove()
      })
    },

    redraw () {
      if (this.internaldata.root) {
        return this.updateGraph()
      }
			this.$emit('zoom', true)
      return Promise.resolve('no graph')
    },

    getNodeOriginComputer (originalVisibleNodes) {
      return node => {
        const parentVisible = findInParents(node, originalVisibleNodes)
        return {x: parentVisible.x0, y: parentVisible.y0}
      }
    },

    applyZoom (size) {
      const {g, zoom} = this.internaldata
      if (this.zoomable) {
        g.call(zoom.transform, this.currentTransform)
      } else {
        this.transformSvg(g, size)
      }
    },

    applyTransition (size, {margin, layout}) {
      const {g, svg, zoom} = this.internaldata
      if (this.zoomable) {
        const transform = this.currentTransform
        const oldMargin = margin || this.margin
        const oldLayout = layout || this.layout

        const nowTransform = oldLayout.updateTransform(transform, oldMargin, size, this.maxTextLenght)
        const nextRealTransform = this.updateTransform(transform, size)
        const current = d3.zoomIdentity.translate(transform.x + nowTransform.x - nextRealTransform.x, transform.y + nowTransform.y - nextRealTransform.y).scale(transform.k)

        svg.call(zoom.transform, current).transition().duration(this.duration).call(zoom.transform, transform)
      } else {
        const transitiong = g.transition().duration(this.duration)
        this.transformSvg(transitiong, size)
      }
    },

    zoomed (g) {
      return () => {
        const transform = d3.event.transform
        const size = this.getSize()
        const transformToApply = this.updateTransform(transform, size)
        this.currentTransform = transform
        this.$emit('zoom', {transform})
        g.attr('transform', transformToApply)
				
				g.selectAll('.node_name')
					.attr('style', 'font-size:' + (this.fontSize / this.currentTransform.k) + 'px' )
					.attr('dy', -10 / this.currentTransform.k)
				
				g.selectAll('.node_value')
					.attr('style', 'font-size:' + (this.fontSize / this.currentTransform.k) + 'px' )
					.attr('dy', 20 / this.currentTransform.k)
				
				g.selectAll('circle').attr('r', this.radius / this.currentTransform.k )
      }
    },

    updateIfNeeded (d, update) {
      return update ? this.updateGraph(d).then(() => true) : Promise.resolve(true)
    },

    // API
    collapse (d, update = true) {
      if (!d.children) {
        return Promise.resolve(false)
      }

      d._children = d.children
      d.children = null
      this.$emit('retract', {
				element: d, 
				data: d.data
			})
      return this.updateIfNeeded(d, update)
    },

    expand (d, update = true) {
      if (!d._children) {
        return Promise.resolve(false)
      }

      d.children = d._children
      d._children = null
      this.$emit('expand', {
				element: d, 
				data: d.data
			})
      return this.updateIfNeeded(d, update)
    },

    expandAll (d, update = true) {
      const lastVisible = d.leaves()
      onAllChilddren(d, child => { this.expand(child, false) })
      return this.updateIfNeeded(this.getNodeOriginComputer(lastVisible), update)
    },

    collapseAll (d, update = true) {
      onAllChilddren(d, child => this.collapse(child, false))
      return this.updateIfNeeded(d, update)
    },

    show (d, update = true) {
      const path = d.ancestors().reverse()
      const root = path.find(node => node.children === null) || d
      path.forEach(node => this.expand(node, false))
      return this.updateIfNeeded(root, update)
    },

    showOnly (d) {
      const root = this.internaldata.root
      const path = d.ancestors().reverse()
      const shouldBeRetracted = mapMany(path, p => p.children ? p.children : []).filter(node => node && (path.indexOf(node) === -1))
      const mapped = {}
      shouldBeRetracted.filter(node => node.children).forEach(rectractedNode => rectractedNode.each(c => { mapped[c.id] = rectractedNode }))
      const origin = node => {
        const reference = mapped[node.id]
        if (!reference) {
          return node
        }
        return {x: reference.x, y: reference.y}
      }
      const updater = node => {
        if (shouldBeRetracted.indexOf(node) !== -1) {
					
          this.collapse(node, false)
          return false
        }
        return (node !== d)
      }
      onAllChilddren(root, updater)
      return this.updateGraph(origin).then(() => true)
    },

    resetZoom () {
      if (!this.zoomable) {
        return Promise.resolve(false)
      }
      const {svg, zoom} = this.internaldata
      const transitionPromise = toPromise(svg.transition().duration(this.duration).call(zoom.transform, () => d3.zoomIdentity))
      return transitionPromise.then(() => true)
    }
  },

  computed: {
    tree () {
      const size = this.getSize()
      const tree = this.type === 'cluster' ? d3.cluster() : d3.tree()
      this.layout.size(tree, size, this.margin, this.maxTextLenght)
      return tree
    },

    margin () {
      return {x: this.marginX, y: this.marginY}
    },

    layout () {
      return layout[this.layoutType]
    }
  },

  watch: {
    data: {
      handler: function (current, old) {
        this.onData(current)
      },
      deep: true
    },

    type () {
      if (!this.internaldata.tree) {
        return
      }
      this.internaldata.tree = this.tree;
			
      this.redraw();
    },

    marginX (newMarginX, oldMarginX) {
      this.completeRedraw({margin: {x: oldMarginX, y: this.marginY}})
    },

    marginY (newMarginY, oldMarginY) {
      this.completeRedraw({margin: {x: this.marginX, y: oldMarginY}})
    },

    layout (newLayout, oldLayout) {
      this.completeRedraw({layout: oldLayout})
    },

    radius () {
      this.completeRedraw({layout: this.layout})
    },

    zoomable (newValue) {
      const { svg, g } = this.internaldata
      let { zoom } = this.internaldata
      if (newValue) {
        zoom = d3.zoom().scaleExtent([0.9, 8])
        zoom.on('zoom', this.zoomed(g))
        svg.call(zoom).on('wheel', () => d3.event.preventDefault())
        svg.call(zoom.transform, this.currentTransform || d3.zoomIdentity)
      } else {
        zoom.on('zoom', null)
        zoom = null
      }
      this.internaldata.zoom = zoom
    }
  }
}
</script>

<style lang="less">

@color-main: #676767;	
@color-t: #009dff;	
@color-l: #cc46cc;	
@color-s: #80c148;	
@color-w: #ff9d00;
@color-d: #ff004e;	
@color-a: #ffd800;		
	
.treeclass svg * {
	vector-effect: non-scaling-stroke;
}

	
.treeclass .nodetree circle {
	stroke-width: 2;
}

.treeclass .node__internal circle {
  cursor: pointer;
  fill:  @color-main;
	stroke: none;
}

.treeclass .nodetree text {
  opacity: .65;
  cursor: pointer;
	text-anchor: middle;
	transition: opacity .2s;
}
	
.treeclass .nodetree text:hover {
  opacity: 1;
	transition: opacity .2s;
}	

.treeclass .nodetree.selected text {
  
}

.treeclass .node__internal text {
  text-shadow: 0 1px 0 #fff, 0 -1px 0 #fff, 1px 0 0 #fff, -1px 0 0 #fff;
}
	
	.node_value {
		font-weight: 700;
	}	

	

.treeclass .linktree {
  fill: none;
  stroke: rgba(0,0,0,0.2);
	mix-blend-mode: darken;
	stroke-linecap: butt;
  stroke-opacity: 0.4;
  stroke-width: 2px;
	pointer-events: none;
}

.treeclass {
  max-height: 100%;
}
	
	.treeclass .linktree.type_t {
		stroke: @color-t;
	}	
	.treeclass .linktree.type_w {
		stroke: @color-w;
	}	
	.treeclass .linktree.type_l {
		stroke: @color-l;
	}	
	.treeclass .linktree.type_s {
		stroke: @color-s;
	}	
	.treeclass .linktree.type_d {
		stroke: @color-d;
	}	
	
	.treeclass .linktree.type_a {
		stroke: @color-a;
	}	

.treeclass .nodetree.type_t circle {
		fill: lighten(@color-t, 40%);
		stroke: @color-t;
}	
	
.treeclass .node__internal.type_t circle {
		fill: @color-t;
}
	
.treeclass .nodetree.type_w circle {
		fill: lighten(@color-w, 40%);
		stroke: @color-w;
}	
	
.treeclass .node__internal.type_w circle {
		fill: @color-w;
}
	
.treeclass .nodetree.type_l circle {
		fill: lighten(@color-l, 40%);
		stroke: @color-l;
}	
	
.treeclass .node__internal.type_l circle {
		fill: @color-l;
}	

.treeclass .nodetree.type_s circle {
		fill: lighten(@color-s, 40%);
		stroke: @color-s;
}	
	
.treeclass .node__internal.type_s circle {
		fill: @color-s;
}	
	
.treeclass .nodetree.type_d circle {
		fill: lighten(@color-d, 40%);
		stroke: @color-d;
}	
	
.treeclass .node__internal.type_d circle {
		fill: @color-d;
}		
	
.treeclass .nodetree.type_a circle {
		fill: lighten(@color-a, 40%);
		stroke: @color-a;
}	
	
.treeclass .node__internal.type_a circle {
		fill: @color-a;
}			
	
</style>
