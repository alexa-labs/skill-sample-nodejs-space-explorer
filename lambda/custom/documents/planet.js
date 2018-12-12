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

module.exports = planet => {
  const datasource = data[planet];
  const imagePreloads = [];

  data[planet].satellites.interesting.forEach(item => {
    imagePreloads.push({
      type: 'Image',
      height: 0,
      width: 0,
      position: 'absolute',
      zIndex: 0,
      opacity: 0,
      source: item.image
    });
  });

  imagePreloads.push({
    type: 'Image',
    height: 0,
    width: 0,
    position: 'absolute',
    zIndex: 0,
    opacity: 0,
    source: data[planet].atmosphereImage
  });

  return {
    type: 'Alexa.Presentation.APL.RenderDocument',
    token: 'planet-details',
    document: {
      type: 'APML',
      version: '1.0',
      theme: 'dark',
      import: [
        { name: 'alexa-styles', version: '1.0.0-beta' },
        { name: 'alexa-layouts', version: '1.0.0-beta' },
        { name: 'layouts', version: '1.0.0', source: `${cdnPath}apl/layouts.json` },
        { name: 'styles', version: '1.0.0', source: `${cdnPath}apl/styles.json` }
      ],
      features: { idleTimeout: 60000 },
      mainTemplate: {
        parameters: ['payload'],
        item: {
          type: 'Frame',
          backgroundColor: 'black',
          item: [
            {
              when: '${@viewportProfile == @hubRoundSmall}',
              type: 'Container',
              direction: 'column',
              height: '100%',
              width: '100%',
              items: [
                ...imagePreloads,
                {
                  type: 'Image',
                  source: '${payload.data.image}',
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  scale: 'best-fit'
                },
                {
                  type: 'Image',
                  source: 'https://s3-us-west-2.amazonaws.com/ddg-skill/assets/rook-full-scrim.png',
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  scale: 'best-fit'
                },
                {
                  type: 'Container',
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  item: {
                    type: 'AlexaHeader',
                    headerTitle: planet.toUpperCase(),
                    headerAttributionPrimacy: false
                  }
                },
                {
                  type: 'Container',
                  paddingLeft: '@marginLeft',
                  paddingRight: '@marginRight',
                  paddingTop: '25vh',
                  height: '100%',
                  items: [{ type: 'PlanetDetailsList', planet: planet.toLowerCase() }]
                }
              ]
            },
            {
              when: '${@viewportProfile != @hubRoundSmall}',
              type: 'Container',
              direction: 'column',
              id: 'container',
              height: '100%',
              width: '100%',
              items: [
                {
                  type: 'Image',
                  source: '${payload.data.backgroundImage}',
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  scale: 'best-fill'
                },
                {
                  type: 'Image',
                  source: '${payload.data.image}',
                  left: planet === 'saturn' ? '-20%' : '42%',
                  bottom: planet === 'saturn' ? '-30%' : '20%',
                  width: planet === 'saturn' ? '200%' : '100%',
                  height: planet === 'saturn' ? '200%' : '100%',
                  position: 'absolute',
                  scale: 'best-fit'
                },
                {
                  type: 'Image',
                  source:
                    'https://s3-us-west-2.amazonaws.com/ddg-skill/assets/scrim-planetdetails.png',
                  right: 0,
                  bottom: 0,
                  height: '100vh',
                  width: planet === 'saturn' ? '100vw' : '100vh',
                  position: 'absolute',
                  scale: 'best-fill'
                },
                {
                  type: 'AlexaHeader',
                  headerTitle: planet.toUpperCase(),
                  headerBackButton: 1,
                  headerNavigationAction: 'backEvent'
                },
                {
                  type: 'Container',
                  paddingLeft: '@marginLeft',
                  grow: 1,
                  shrink: 1,
                  items: [
                    { type: 'PlanetDetailsList', planet: planet.toLowerCase() },
                    {
                      when: planet === 'the sun',
                      type: 'Container',
                      direction: 'row',
                      paddingBottom: '15dp',
                      items: [
                        {
                          type: 'Container',
                          spacing: '68dp',
                          items: [
                            {
                              type: 'Text',
                              style: 'textStyleCaption',
                              opacity: 0.75,
                              text: 'STAR-TYPE'
                            },
                            { type: 'Text', style: 'textStyleCallout', text: datasource.type }
                          ]
                        },
                        {
                          type: 'Container',
                          spacing: '68dp',
                          items: [
                            {
                              type: 'Text',
                              style: 'textStyleCaption',
                              opacity: 0.75,
                              text: 'APPROXIMATE AGE'
                            },
                            { type: 'Text', style: 'textStyleCallout', text: datasource.age }
                          ]
                        }
                      ]
                    },
                    {
                      when: `\${@viewportProfile == @tvLandscapeXLarge && '${planet}' != 'the sun'}`,
                      type: 'Container',
                      direction: 'row',
                      paddingBottom: '15dp',
                      items: [
                        {
                          type: 'Container',
                          spacing: '68dp',
                          items: [
                            {
                              type: 'Text',
                              style: 'textStyleCaption',
                              opacity: 0.75,
                              text: 'LENGTH OF YEAR'
                            },
                            {
                              type: 'Text',
                              style: 'textStyleCallout',
                              text: `${datasource.year.toLocaleString()} Earth Days`
                            }
                          ]
                        },
                        {
                          type: 'Container',
                          spacing: '68dp',
                          items: [
                            {
                              type: 'Text',
                              style: 'textStyleCaption',
                              opacity: 0.75,
                              text: 'LENGTH OF DAY'
                            },
                            {
                              type: 'Text',
                              style: 'textStyleCallout',
                              text: `${datasource.day.toLocaleString()} Earth Hours`
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  type: 'AlexaFooter',
                  when:
                    '${(@viewportProfile == @hubLandscapeMedium && viewport.height > 600) || @viewportProfile != @hubLandscapeMedium}',
                  hintText: '${payload.data.properties.hint}'
                },
                {
                  type: 'Container',
                  position: 'absolute',
                  top: '200vh',
                  opacity: 0,
                  items: imagePreloads
                }
              ]
            }
          ]
        }
      }
    },
    datasources: {
      data: {
        backgroundImage: data.backgroundImage,
        ...datasource,
        properties: {
          hintText: planet === 'the sun' ? 'tell me about it.' : 'how far away is it?'
        },
        transformers: [{ inputPath: 'hintText', outputName: 'hint', transformer: 'textToHint' }]
      }
    }
  };
};
