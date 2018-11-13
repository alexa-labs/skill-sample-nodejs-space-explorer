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

const cdnPath = require('../helpers/cdn-path');

module.exports = (resource, title = null) => ({
  type: 'Alexa.Presentation.APL.RenderDocument',
  token: 'transcript_document',
  document: {
    type: 'APL',
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
    features: {
      idleTimeout: 60000
    },
    mainTemplate: {
      parameters: ['payload'],
      item: [
        {
          type: 'Container',
          width: '100%',
          height: '100%',
          item: [
            {
              type: 'Frame',
              id: 'bgImage',
              backgroundColor: 'black',
              width: '100vw',
              height: '100vh',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              item: [
                {
                  type: 'Image',
                  scale: 'best-fill',
                  width: '100vw',
                  height: '100vh',
                  source: resource.image,
                  opacity: 1
                }
              ]
            },
            {
              type: 'Image',
              position: 'absolute',
              scale: 'best-fill',
              width: '100vw',
              height: '100vh',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              source: 'https://d1od0khoye9qi3.cloudfront.net/image_scrim.png'
            },
            {
              type: 'ScrollView',
              width: '100%',
              height: '100%',
              id: 'scrollContainer',
              onScroll: {
                type: 'SetValue',
                componentId: 'bgImage',
                property: 'opacity',
                value: '${Math.max(1 - event.source.value, 0.4)}'
              },
              items: [
                {
                  type: 'Container',
                  items: [
                    {
                      when: title !== null,
                      type: 'AlexaHeader',
                      position: 'absolute',
                      headerTitle: title,
                      headerBackButton: 1,
                      headerNavigationAction: 'backEvent'
                    },
                    {
                      type: 'Container',
                      paddingTop: '75vh',
                      paddingLeft: '@marginLeft',
                      paddingRight: '@marginRight',
                      paddingBottom: 150,
                      width: '100%',
                      backgroundColor: 'black',
                      alignItems: "${@viewportProfile == @hubRoundSmall ? 'center' : 'start'}",
                      item: [
                        {
                          type: 'Text',
                          style: 'textStyleHeadlineAlt',
                          spacing: resource.source ? '10dp' : 0,
                          text: resource.title
                        },
                        {
                          when: resource.source !== undefined,
                          type: 'Text',
                          style: 'textStyleLabel',
                          paddingBottom: '26dp',
                          text: `Image: ${resource.source}`
                        },
                        {
                          type: 'Text',
                          style: 'textStyleKaraoke',
                          spacing: resource.source ? '26dp' : '60dp',
                          text: '${payload.resource.properties.text}',
                          id: 'imageText',
                          speech: '${payload.resource.properties.speech}'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  },
  datasources: {
    resource: {
      type: 'object',
      properties: {
        ssml: `<speak>${resource.description}</speak>`,
        text: resource.description
      },
      transformers: [
        {
          inputPath: 'ssml',
          outputName: 'speech',
          transformer: 'ssmlToSpeech'
        }
      ]
    }
  }
});
