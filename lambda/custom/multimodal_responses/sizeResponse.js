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

const SizeDirective = require('../documents/size');
const data = require('../data/planets.json');

module.exports = (handlerInput, object1, object2 = 'earth', text, speak = true) => {
  let speech;
  let obj2 = object2;

  if (object1.toLowerCase() === 'earth' && object2.toLowerCase() === 'earth') {
    obj2 = 'the sun';
  }

  speech = text || `${object1}'s diameter is ${data[object1.toLowerCase()].diameter} miles.`;

  const object1W = data[object1.toLowerCase()].diameter;
  const object2W = obj2 ? data[obj2.toLowerCase()].diameter : data.earth.diameter;
  const comparator =
    object1W > object2W
      ? `${(object1W / object2W).toFixed(2)} times larger`
      : `${(object2W / object1W).toFixed(2)} times smaller`;

  if (!text) {
    speech += ` That's ${comparator} than ${object2}`;
  }

  const attributes = handlerInput.attributesManager.getSessionAttributes();

  if (
    attributes.previousLocation &&
    attributes.previousLocation[attributes.previousLocation.length - 1] !== attributes.location
  ) {
    attributes.previousLocation.push(attributes.location);
  }

  handlerInput.attributesManager.setSessionAttributes(attributes);

  return handlerInput.responseBuilder
    .addDirective(SizeDirective(object1.toLowerCase(), obj2.toLowerCase(), comparator))
    .speak(speak !== false && speech)
    .getResponse();
};
