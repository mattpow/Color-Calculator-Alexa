var Alexa = require('alexa-sdk');

exports.handler = function(event, context, callback){
    var alexa = Alexa.handler(event, context, callback);
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit(':ask', 'Welcome to color calculator.  What color do you want to convert?');
    },

    'AMAZON.CancelIntent': function () {
        this.emit(':tell', "Goodbye!");
    },

    'AMAZON.StopIntent': function () {
        this.emit(':tell', "Goodbye!");
    },

    'AMAZON.HelpIntent': function () {
        var message = 'You can convert any color between RGB and HEX values. Ask me to convert red twenty, green one hundred seventy five, blue two hundred to HEX, or ask me to convert f, f, six, four, a, d to RGB. What would you like to do?';
        this.emit(':ask', message);
    },

    'convertToHEX': function () {
        var intentObj = this.event.request.intent;
        if (!intentObj.slots.redValue.value) {
            var slotToElicit = 'redValue';
            var speechOutput = 'What is the red value?';
            var repromptSpeech = speechOutput;
            var updatedIntent = this.event.request.intent;
            this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech, updatedIntent);
        } else if (!intentObj.slots.greenValue.value) {
            var slotToElicit = 'greenValue';
            var speechOutput = 'What is the green value?';
            var repromptSpeech = speechOutput;
            var updatedIntent = this.event.request.intent;

            this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech, updatedIntent);
        } else if (!intentObj.slots.blueValue.value) {
            var slotToElicit = 'blueValue';
            var speechOutput = 'What is the blue value?';
            var repromptSpeech = speechOutput;
            var updatedIntent = this.event.request.intent;
            this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech, updatedIntent);
        } else {
            var slots = this.event.request.intent.slots;
            if (slots.redValue.value > 255) {
                slots.redValue.value = 255;
            } else if (slots.redValue.value < 0) {
                slots.redValue.value *= -1;
            }

            if (slots.greenValue.value > 255) {
                slots.greenValue.value = 255;
            } else if (slots.greenValue.value < 0) {
                slots.greenValue.value *= -1;
            }

            if (slots.blueValue.value > 255) {
                slots.blueValue.value = 255;
            } else if (slots.blueValue.value < 0) {
                slots.blueValue.value *= -1;
            }
            this.emit(':tell', 'Red ' + slots.redValue.value + ', Green ' + slots.greenValue.value + ', Blue ' + slots.blueValue.value + " is " + rgb2hex(slots.redValue.value, slots.greenValue.value, slots.blueValue.value));
        }
    },

    'convertToRGB': function () {
        var slots = this.event.request.intent.slots;
        if (!slots.hex_one.value || !slots.hex_two.value || !slots.hex_three.value || !slots.hex_four.value || !slots.hex_five.value || !slots.hex_six.value) {
            this.emit(':tell', "Sorry, I didn't get that. Try again");
        } else {
            slots.hex_one.value = slots.hex_one.value.charAt(0);
            slots.hex_two.value = slots.hex_two.value.charAt(0);
            slots.hex_three.value = slots.hex_three.value.charAt(0);
            slots.hex_four.value = slots.hex_four.value.charAt(0);
            slots.hex_five.value = slots.hex_five.value.charAt(0);
            slots.hex_six.value = slots.hex_six.value.charAt(0);
            var concatHEX = slots.hex_one.value+slots.hex_two.value+slots.hex_three.value+slots.hex_four.value+slots.hex_five.value+slots.hex_six.value;
            var RGBValue = hexToRgb(concatHEX);
            RGBValue = RGBValue.replace(',', ', ');
            this.emit(':tell', "# " + slots.hex_one.value + ", " + slots.hex_two.value + ", " + slots.hex_three.value + ", " + slots.hex_four.value + ", " + slots.hex_five.value + ", " + slots.hex_six.value + " is " + RGBValue);
        }
    },

    'SessionEndedRequest': function () {
        this.emit(':tell', "Goodbye!");
    }
}

function rgb2hex(red, green, blue) {
        var rgb = blue | (green << 8) | (red << 16);
        return '#' + (0x1000000 + rgb).toString(16).slice(1)
 }

 function hexToRgb(hex) {
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;

    return r + ", " + g + ", " + b;
}
