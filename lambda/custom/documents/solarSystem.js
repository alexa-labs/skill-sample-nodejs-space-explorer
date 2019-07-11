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

module.exports = () => ({
  type: 'Alexa.Presentation.APL.RenderDocument',
  token: 'solar-system',
  document: {
    type: 'APL',
    version: '1.1',
    theme: 'dark',
    import: [
      {
        name: 'alexa-styles',
        version: '1.1.0-eifjccgiclfvkinnkcftdcdeklbrnlhchfcihjjdghdi'
      },
      {
        name: 'alexa-layouts',
        version: '1.1.0-eifjccgiclfvkinnkcftdcdeklbrnlhchfcihjjdghdi'
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
        type: 'Frame',
        backgroundColor: 'black',
        onMount: [
          {
            type: 'SolarSystemReveal'
          }
        ],
        items: [
          {
            when: '${@viewportProfile == @hubRoundSmall}',
            type: 'SolarSystemSmallRoundHub',
            data: '${payload.data.properties.data}'
          },
          {
            when: '${@viewportProfile != @hubRoundSmall}',
            type: 'SolarSystem',
            data: '${payload.data.properties.data}',
            hintText: '${payloaddata.properties.hint}'
          }
        ]
      }
    }
  },
  datasources: {
    data: {
      properties: {
        hintText: 'take me to the outer planets.',
        data
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
