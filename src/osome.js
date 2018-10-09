const host = {
  'Production': 'api.osome.com',
  'Stage': 'api.stage.osome.club',
  'Dev': 'api.dev.osome.club'
};

const agentHost = {
  'Production': 'app.osome.com',
  'Stage': 'app.stage.osome.club',
  'Dev': 'app.dev.osome.club'
};

const dialogFlowAgent = {
  'Production': '317ab6a2-90a4-4da7-938e-3143ed4ad1d1',
  'Stage': 'e97a326a-f3fe-4273-be7f-5ab0567237f1',
  'Dev': '7847a518-d6a3-434c-b8c3-2e6c23a10483'
};

function loadFromApi(env, token) {
  return Promise.all([getIntents(env, token), getPayloads(env, token)])
    .then(result => {
      const payloads = transformData(result[1].data.fbhooks, result[0].intents, env);
      console.log('All payloads', payloads);
      const internalPayloads = getInternalPayloads(payloads);
      console.log('Internal payloads', internalPayloads);
      const main = ['new_user_start', 'guest_start', 'invited_user_start', 'get_started_payload'];
      const topLevel = topLevelPayloads(payloads, internalPayloads)
        .filter(payload => !main.includes(payload.name));
      console.log('Top level payloads', topLevel);
      const dialogFlowFallbacks = payloads.filter(intent => (intent.inputContexts && (intent.inputContexts.length === 0)));
      const treeData = {
        name: env,
        children: [
          {
            name: 'Main',
            children: payloads.filter(p => main.includes(p.name)).map(p => getTreeNodes(p))
          },
          {
            name: 'Orphaned',
            children: splitChildren(topLevel.map(p => getTreeNodes(p)))
          },
          {
            name: 'Dialogflow Misc',
            children: splitChildren(dialogFlowFallbacks.map(p => getTreeNodes(p)))
          }
        ]
      };
      draw(treeData);
    });
}

function login(email, password, env) {
  return fetch(`https://${host[env]}/api/v1/auth`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      email,
      password
    })
  }).then(result => result.json());
}

function getPayloads(env, token) {
  return fetch(`https://${host[env]}/api/v1/fbhooks?page=1&perPage=500`, {
    headers: {
      'x-access-token': token
    }
  }).then(result => result.json());
}

function getIntents(env, token) {
  return fetch(`https://${host[env]}/api/v2/chatbot/dialogflow/intents`, {
    headers: {
      'x-access-token': token
    }
  }).then(result => result.json());
}

function getPayloadUrl(payload, env) {
  return `https://${agentHost[env]}/hooks/${payload.id}`;
}

function getIntentUrl(intent, env) {
  const id = intent.id.match(/intents\/([a-z0-9\-]+)$/)[1];
  return `https://console.dialogflow.com/api-client/#/agent/${dialogFlowAgent[env]}/editIntent/${id}/`
}

function transformData(rawPayloads, rawIntents, env) {
  
  const payloads = rawPayloads.map(payload => ({
    id: payload.id,
    name: payload.payload,
    response: JSON.parse(payload.response),
    url: getPayloadUrl(payload, env)
  }));

  
  
  const intents = rawIntents
    .filter(intent => {
      if (!intent.inputContexts || intent.inputContexts.length !== 1) return true;
      const id = intent.name.replace(intent.inputContexts[0] + '_', '');
      if (!id) return true;
      return !id.match(/^[0-9]+$/);
    })
    .map(intent => ({
      id: intent.id, 
      name: intent.name,
      url: getIntentUrl(intent, env),
      inputContexts: intent.inputContexts,
      dialogFlow: true,
      response: [],
      payloads: intent.payloads,
    }));
  
  
  
  const result = [...payloads, ...intents];
  result.forEach(p => getChildren(p, result));
  result.forEach(p => attachParents(p, result));
  result.forEach(p => {
    p.text = getText(p);
  });
  
  
  return result;
}

function getText(payload) {
  const text = payload.response
    .filter(r => Boolean(r.text))
    .map(r => r.text);
  const widgetText = payload.response
    .map(r => r.attachment && r.attachment.payload && r.attachment.payload.elements)
    .filter(r => r && r.length)
    .reduce((acc, val) => acc.concat(val), [])
    .map(r => [r.title, r.subtitle])
    .reduce((acc, val) => acc.concat(val), [])
    .filter(p => Boolean(p));
  return [...text, ...widgetText].filter(t => Boolean(t)).join('\n');
}

function getChildren(payload, allPayloads) {
  try {
    if (payload.children) return payload.children;
    const quickReplyPayloads = payload.response
      .map(r => r.quick_replies)
      .filter(r => Boolean(r))
      .reduce((acc, val) => acc.concat(val), [])
      .map(r => r.payload)
      .filter(p => Boolean(p));
    const templateButtonPayloads = payload.response
      .map(r => r.attachment && r.attachment.payload && r.attachment.payload.elements)
      .filter(r => r && r.length)
      .reduce((acc, val) => acc.concat(val), [])
      .filter(r => Boolean(r.buttons))
      .map(r => r.buttons)
      .reduce((acc, val) => acc.concat(val), [])
      .map(b => b.payload)
      .filter(p => Boolean(p));
    const buttonPayloads = payload.response
      .map(r => r.attachment && r.attachment.payloadS)
      .filter(r => r && r.length)
      .reduce((acc, val) => acc.concat(val), [])
      .map(b => b.payload)
      .filter(p => Boolean(p));
    const switchPayloads = payload.response
      .map(r => r.switch)
      .filter(s => s && s.length)
      .reduce((acc, val) => acc.concat(val), [])
      .map(s => s.goto);
    const actionPayloads = payload.response
      .map(r => r.action && r.action.cases)
      .filter(c => Boolean(c))
      .map(c => Object.values(c))
      .reduce((acc, val) => acc.concat(val), []);
    const dialogflowPayloads = payload.payloads || [];
    const children = [...quickReplyPayloads, ...templateButtonPayloads, ...buttonPayloads, ...switchPayloads,
      ...actionPayloads, ...dialogflowPayloads].filter(onlyUnique);
    payload.children = children.map(name => allPayloads.find(p => p.name === name));
    if (payload.children.some(p => !p)) {
      console.error(`Missing children links`, payload);
      payload.children = payload.children.filter(p => Boolean(p));
    }
    return payload.children;
  } catch (e) {
    console.error(`Unable to process children`, payload.name, payload.response, payload.payloads, e);
  }
}

function attachParents(payload, allPayloads) {
  if (!payload.inputContexts || payload.inputContexts.length === 0) return;
  payload.inputContexts.forEach(context => {
    const parent = allPayloads.find(p => p.name === context);
    if (parent) {
      parent.children.push(payload);
    }
  })
}

const chunkSize = 10;

function splitChildren(children) {
  if (children.length <= chunkSize) return children;
  const chunkedChildren = [];
  for (let i = 0; i < children.length / chunkSize; i += 1) {
    const start = i * chunkSize;
    const end = Math.min((i + 1) * chunkSize, children.length);
    chunkedChildren.push({
      name: `[${start + 1}..${end}]`,
      children: children.slice(start, end),
    })
  }
  return chunkedChildren;
}

function getCircle(payload) {
  if (payload.dialogFlow) return 'D';
  const r = payload.response;
  if (r.find(r => r.switch)) return 'S';
  if (r.find(r => r.action)) return 'A';
  if (r.find(r => r.attachment)) return 'W';
  if (r.find(r => r.text)) return 'T';
  return '';
}

function getTreeNodes(payload, previousNodes = []) {
  if (previousNodes.includes(payload.name)) return { name: `${payload.name} (loop)`, circle: 'L' };
  const nodes = [...previousNodes, payload.name];
  const children = payload.children.map(child => getTreeNodes(child, nodes));
  return {
    name: payload.name,
    children: splitChildren(children),
    circle: getCircle(payload),
    url: payload.url,
    text: payload.text
  }
}

function getInternalPayloads(payloads) {
  return payloads
    .map(p => p.children)
    .filter(onlyUnique)
    .reduce((acc, val) => acc.concat(val), []);
}

function topLevelPayloads(payloads, outgoingPayloads) {
  return payloads
    .filter(p => !outgoingPayloads.some(o => o.name === p.name))
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}