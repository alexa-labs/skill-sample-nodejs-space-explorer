/*
 * Copyright 2018 Amazon.com, Inc. and its affiliates. All Rights Reserved.
 * 
 * Licensed under the Amazon Software License (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 * 
 * http: //aws.amazon.com/asl/
 * 
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

const planetData = require('../data/planets.json');
const cdnPath = require('../helpers/cdn-path');

module.exports = zone => {
  const planets = [];

  Object.keys(planetData).forEach(k => {
    const item = planetData[k];
    if (item.region && item.region === zone.toLowerCase()) {
      planets.push(item);
    }
  });

  planets.sort((a, b) => a.distance - b.distance);

  return {
    type: 'Alexa.Presentation.APL.RenderDocument',
    token: 'solar-system-zone',
    document: {
      type: 'APML',
      version: '1.0',
      theme: 'dark',
      import: [
        {
          name: 'alexa-styles',
          version: '1.0.0-beta'
        },
        {
          name: 'alexa-layouts',
          version: '1.0.0-beta'
        },
        {
          name: 'layouts',
          version: '1.0.0',
          source: `${cdnPath}apl/layouts.json`
        },
        {
          name: 'styles',
          version: '1.0.0',
          source: `${cdnPath}apl/styles.json`
        }
      ],
      mainTemplate: {
        parameters: ['payload'],
        item: {
          type: 'ZoneList',
          backgroundImage: '${payload.data.backgroundImage}',
          title: `${zone.toUpperCase()} SOLAR SYSTEM`,
          hintText: '${payload.data.properties.hint}',
          listData: '${payload.data.properties.planets}'
        }
      }
    },
    datasources: {
      data: {
        type: 'object',
        backgroundImage: planetData.backgroundImage,
        properties: {
          planets,
          hintText: 'take me to Venus.'
        },
        transformers: [
          {
            inputPath: 'hintText',
            outputName: 'hint',
            transformer: 'textToHint'
          }
        ]
      }
    }
  };
};
