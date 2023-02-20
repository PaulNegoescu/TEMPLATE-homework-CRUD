(async function () {
  const entities = [
    // 'films',
    // 'people',
    // 'planets',
    // 'species',
    // 'starships',
    // 'vehicles',
  ];

  for (const entity of entities) {
    const resources = await fetch(`https://swapi.dev/api/${entity}`).then(
      (res) => res.json()
    );

    processResources(resources, entity);
  }
})();

function urlToId(url) {
  return Number(url.match(/(\d)+/g)[0]);
}

function propsToId(obj, props) {
  for (const prop of props) {
    if (!obj[prop]) {
      continue;
    }
    obj[prop] = obj[prop].map(urlToId);
  }
}

function deleteProps(obj, props) {
  for (const prop of props) {
    if (!obj[prop]) {
      continue;
    }
    delete obj[prop];
  }
}

async function processResources(resources, entity) {
  const promises = [];
  for (const resource of resources.results) {
    propsToId(resource, [
      'films',
      'characters',
      'people',
      'pilots',
      'residents',
      'planets',
      'starships',
      'vehicles',
      'species',
    ]);

    propToId(resource, ['homeworld']);

    deleteProps(resource, ['url', 'created', 'edited']);
    const targetEntity = entity !== 'people' ? entity : 'characters';

    promises.push(
      fetch(`http://localhost:3000/${targetEntity}`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(resource),
      })
    );
  }
  await Promise.all(promises);
  if (resources.next) {
    const data = await fetch(resources.next).then((res) => res.json());
    processResources(data, entity);
  }
}

function propToId(obj, props) {
  for (const prop of props) {
    if (!obj[prop]) {
      continue;
    }
    obj[prop] = urlToId(obj[prop]);
  }
}

async function countEntities() {
  const entities = [
    'films',
    'people',
    'planets',
    'species',
    'starships',
    'vehicles',
  ];

  const promises = [];

  for (const e of entities) {
    const targetE = e !== 'people' ? e : 'characters';
    promises.push(
      fetch(`http://localhost:3000/${targetE}`)
        .then((res) => res.json())
        .then((d) => d.length)
    );
  }

  const counts = await Promise.all(promises);
  entities.forEach((e, i) => console.log(e, counts[i]));
}

countEntities();
