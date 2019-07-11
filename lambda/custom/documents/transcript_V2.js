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
      item: [
        {
          type: 'Container',
          width: '100vw',
          height: '100vh',
          items: [
            {
              type: 'AlexaTranscript',
              speakItemComponentId: 'imageText',
              requestString: resource.title,
              primaryContent: 'text',
              karaokeText: '${payload.resource.properties.text}',
              karaokeSpeech: '${payload.resource.properties.speech}',
              backgroundImageSource: !resource.video ? resource.image : null,
              backgroundVideoSource: resource.video,
              backgroundOverlayGradient: true,
              backgroundVideoAutoPlay: true,
              backgroundVideoAudioTrack: 'none'
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
