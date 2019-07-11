module.exports = () => {
    return {
        type: 'Alexa.Presentation.APL.RenderDocument',
        token: 'object-size',
        document: {
            "type": "APL",
            "version": "1.1",
            "theme": "dark",
            "import": [
                {
                    "name": "soft-stagger",
                    "version": "1.0.0",
                    "source": "https://s3-us-west-2.amazonaws.com/ddg-skill/apl/soft-stagger.json"
                }
            ],
            "commands": {
                "test": {
                    "command": {
                        "type": "AnimateItem",
                        "componentId": "target",
                        "easing": "ease-out",
                        "duration": 666,
                        "value": [
                            {
                                "property": "opacity",
                                "from": 0,
                                "to": 1
                            },
                            {
                                "property": "transform",
                                "from": {
                                    "tranlateY": 80
                                },
                                "to": {
                                    "translateY": 0
                                }
                            }
                        ]
                    }
                }
            },
            "onMount": [
                {
                    "type": "test"
                }
            ],
            "mainTemplate": {
                "parameters": [],
                "item": {
                    "type": "Container",
                    "width": "100vw",
                    "height": "100vh",
                    "items": [
                        {
                            "type": "TouchWrapper",
                            "onPress": [
                                {
                                    "type": "test"
                                }
                            ],
                            "item": {
                                "type": "Frame",
                                "width": 200,
                                "height": 60,
                                "backgroundColor": "red"
                            }
                        },
                        {
                            "type": "Frame",
                            "width": 100,
                            "height": 100,
                            "backgroundColor": "white",
                            "opacity": 0,
                            "id": "target",
                            "position": "absolute",
                            "top": "48vh",
                            "left": "48vw"
                        }
                    ]
                }
            }
        }
    };
}