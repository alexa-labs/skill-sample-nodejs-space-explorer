#!/bin/bash
HEADER="/*\n * Copyright $(date +%Y) Amazon.com, Inc. and its affiliates. All Rights Reserved.\n * \n * Licensed under the Amazon Software License (the \"License\").\n * You may not use this file except in compliance with the License.\n * A copy of the License is located at\n * \n * http: //aws.amazon.com/asl/\n * \n * or in the \"license\" file accompanying this file. This file is distributed\n * on an \"AS IS\" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\n * express or implied. See the License for the specific language governing\n * permissions and limitations under the License.\n */\n"

if [[ $1 != */ ]]
then
    DIRECTORY=$1/
else
    DIRECTORY=$1
fi

for filename in $DIRECTORY*.js; do
    echo -e "$HEADER\n$(cat $filename)" > $filename
done
