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

const Handler = require('../helpers/handler');
const AboutResponse = require('../multimodal_responses/aboutResponse');

const ObjectAboutHandler = Handler('ObjectAbout', handlerInput => {
  const slot = handlerInput.requestEnvelope.request.intent.slots.celestial_object.value;
  const location = slot || handlerInput.attributesManager.getSessionAttributes().location;

  return AboutResponse(handlerInput, location.toLowerCase());
});

module.exports = ObjectAboutHandler;
