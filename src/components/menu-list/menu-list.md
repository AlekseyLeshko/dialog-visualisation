```js
<menu-list
	v-bind:list="[
					{
						value: '1',
						name: 'All tasks'
					},
					{
						value: '2',
						name: 'Created by me'
					},
					{
						value: '3',
						name: 'Assigned to me'
					}
				]" 
	v-bind:active="0"
	v-bind:k="'name'"
	v-bind:v="'name'">
</menu-list>
```
