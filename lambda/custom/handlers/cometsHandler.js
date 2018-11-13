/*
 * Copyright 2018 Amazon.com, Inc. and its affiliates. All Rights Reserved.
 * 
 * Licensed under the Amazon Software License (the License).
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 * 
 * http: //aws.amazon.com/asl/
 * 
 * or in the license file accompanying this file. This file is distributed
 * on an AS IS BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

const description =
  "Comets are cosmic snowballs of frozen gases, rock and dust that orbit the Sun. When frozen, they are the size of a small town. When a comet's orbit brings it close to the Sun, it heats up and spews dust and gases into a giant glowing head larger than most planets. The dust and gases form a tail that stretches away from the Sun for millions of miles. There are likely billions of comets orbiting our Sun in the Kuiper Belt and even more distant Oort Cloud. The current number of known comets is: 3,535";

const Handler = require('../helpers/handler');
const TranscriptDirective = require('../documents/transcript');

const CometsRequestHandler = Handler('CometsIntent', handlerInput => {
  const attributes = handlerInput.attributesManager.getSessionAttributes();
  const { location } = attributes;

  if (
    attributes.previousLocation &&
    attributes.previousLocation[attributes.previousLocation.length - 1] !== location
  ) {
    attributes.previousLocation.push(location);
  }

  if (!attributes.previousLocation) {
    attributes.previousLocation = ['solar system'];
  }

  handlerInput.attributesManager.setSessionAttributes(attributes);

  return handlerInput.responseBuilder
    .addDirective(
      TranscriptDirective({
        image: 'https://s3-us-west-2.amazonaws.com/ddg-skill/assets/comet.jpg',
        title: 'Comets',
        source: 'NASA',
        description
      })
    )
    .addDirective({
      type: 'Alexa.Presentation.APL.ExecuteCommands',
      token: 'transcript_document',
      commands: [
        {
          type: 'SpeakItem',
          componentId: 'imageText',
          highlightMode: 'line',
          align: 'center'
        },
        {
          type: 'Scroll',
          componentId: 'scrollContainer',
          distance: -10000
        }
      ]
    })
    .getResponse();
});

module.exports = CometsRequestHandler;
