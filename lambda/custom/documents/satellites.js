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

const data = require('../data/planets.json');
const cdnPath = require('../helpers/cdn-path');

function capitalize(string) {
  const arr = string.split('');

  arr[0] = arr[0].toUpperCase();
  return arr.join('');
}

module.exports = planet => ({
  type: 'Alexa.Presentation.APL.RenderDocument',
  token: 'object_satellites',
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
        type: 'MoonList',
        backgroundImage: '${payload.data.backgroundImage}',
        hintText: '${payload.data.properties.hint}',
        listData: '${payload.data.listItems}',
        planet: capitalize(planet)
      }
    }
  },
  datasources: {
    data: {
      type: 'object',
      backgroundImage: data.backgroundImage,
      listItems: data[planet].satellites.interesting,
      properties: {
        hintText: 'how many moons does Venus have?'
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
});
