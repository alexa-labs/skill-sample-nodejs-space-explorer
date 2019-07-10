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

const CompositionDirective = require('../documents/atmosphere');
const data = require('../data/planets.json');

module.exports = (handlerInput, location, speak = true) => {
  let speech = '';
  let comp;

  if (location && data[location.toLowerCase()]) {
    comp = data[location.toLowerCase()].atmosphere;
    speech = `${location}'s atmosphere is made up of `;

    comp.forEach((item, i) => {
      let percentage;
      const cleaned = item.percentage.toString();

      if (cleaned.search('~') !== -1) {
        percentage = `about ${cleaned.substr(1)}`;
      } else if (cleaned.search('<') !== -1) {
        percentage = `less than ${cleaned.substr(1)}`;
      } else {
        percentage = cleaned;
      }

      speech += `${(i === comp.length - 1 && comp.length > 1 ? 'and ' : '') + percentage}% ${
        item.element
      }${i === comp.length - 1 ? '.' : ', '}`;
    });
  } else {
    speech = "I'm not sure I know that one.";
  }

  const attributes = handlerInput.attributesManager.getSessionAttributes();

  if (
    attributes.previousLocation &&
    attributes.previousLocation[attributes.previousLocation.length - 1] !== location
  ) {
    attributes.previousLocation.push(location);
  }

  handlerInput.attributesManager.setSessionAttributes(attributes);

  if (comp.length === 0) {
    speech = `${location} has no atmosphere.`;
  }
  if (handlerInput.requestEnvelope.context.System.device.supportedInterfaces['Alexa.Presentation.APL']) {
    return handlerInput.responseBuilder
      .addDirective(CompositionDirective(location.toLowerCase(), comp))
      // .addDirective({
      //   type: 'Alexa.Presentation.APL.ExecuteCommands',
      //   token: 'atmospheric-composition',
      //   commands: [
      //     {
      //       type: 'onLoad'
      //     }
      //   ]
      // })
      .speak(speak && speech)
      .getResponse();
  } else {
    return handlerInput.responseBuilder
      .speak(speech)
      .getResponse();
  }
};
