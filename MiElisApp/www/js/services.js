angular.module('services', [])

.service('midataService',function() {

  var app = {
    server: 'https://test.midata.coop:9000',
    appname: 'MiElisApp',
    appsecret: 'MEA2016HSCA4T'
  }

  var md = new midata.Midata(app.server, app.appname, app.appsecret);

  this.login = function(user) {
    md.login(user.User, user.Password)
    .then(function() {
        console.log('Logged in!');
    });
  }

  this.logout = function() {
    md.logout();
    console.log("logged out");
  }

  this.loggedIn = function() {
    return md.loggedIn;
  }

  this.saveWeight = function(w, d) {
    var weight = new midata.BodyWeight(w, d);
    return md.save(this.getJSONWeight(w, d));
  }

  this.saveBloodPressure = function(sys, dia, d) {
    var bloodPressure = new midata.BloodPressure(sys, dia, d);
    return md.save(this.getJSONBloodPressure(sys, dia, d));
  }

  this.savePulse = function(p, d) {
    var pulse = new midata.HeartRate(p, d);
    return md.save(this.getJSONPulse(p, d));
  }

  this.saveGlucose = function(s, val) {
    var obs = new midata.Observation(s.getValueSt(val),new Date(),s.getCodeSt());
    return md.save(obs);
  }

  this.search = function(res,params) {
    return md.search(res,params);
  }

//get the created JSON files with the given parameters
// - weight: --> getJSONWeight(w,d)
//    w:weight, d:Date
// - pulse: --> getJSONPulse(p,d)
//    p:pulse, d:Date
// - blood pressure: --> getJSONBloodPressure(sys,dia,d)
//    sys:systolic BP, dia: diastolic BP, d:Date
  this.getJSONWeight = function(w, d) {
    var data = {
        resourceType: 'Observation',
        code: {
        coding: [{
            system: 'http://loinc.org',
            code: '3141-9',
            display: 'Weight Measured'
        }]
        },
        effectiveDateTime: d,
        valueQuantity: {
          value: w,
          unit: 'kg',
          system: 'http://unitsofmeasure.org'
        }
      };
      return data;
  }

  this.getJSONPulse = function(p, d) {
    var data = {
        resourceType: "Observation",
        status: "preliminary",
        code: {
          text: "Herzfrequenz",
          coding: [
            {
              system: "http://loinc.org",
              display: "Herzfrequenz",
              code: "8867-4"
            }
          ]
        },
        effectiveDateTime: d,
        category: {
          coding: [
            {
              system: "http://hl7.org/fhir/observation-category",
              code: "vital-signs",
              display: "Vital Signs"
            }
          ],
          text: "Vital Signs"
        },
        valueQuantity: {
          unit: "{beats}/min",
          value: p
        }
    }
    return data;
  }

  this.getJSONBloodPressure = function(sys, dia, d) {
    var data = {
      	resourceType: "Observation",
      	status: "preliminary",
      	code: {
      		text: "Blood Pressure",
      		coding: [
      			{
      				system: "http://loinc.org",
      				display: "Blood Pressure",
      				code: "55417-0"
      			}
      		]
      	},
      	effectiveDateTime: d,
      	category: {
      		coding: [
      			{
      				system: "http://hl7.org/fhir/observation-category",
      				code: "vital-signs",
      				display: "Vital Signs"
      			}
      		],
      		text: "Vital Signs"
      	},
      	component: [
      		{
      			code: {
      				text: "Systolic blood pressure",
      				coding: [
      					{
      						system: "http://loinc.org",
      						display: "Systolic blood pressure",
      						code: "8480-6"
      					}
      				]
      			},
      			valueQuantity: {
      				unit: "mm[Hg]",
      				value: sys
      			}
      		},
      		{
      			code: {
      				text: "Diastolic blood pressure",
      				coding: [
      					{
      						system: "http://loinc.org",
      						display: "Diastolic blood pressure",
      						code: "8462-4"
      					}
      				]
      			},
      			valueQuantity: {
      				unit: "mm[Hg]",
      				value: dia
      			}
      		}
      	]
      }
    return data;
  }
})

.service('json',function() {

  this.getValueSt = function(val) {
    var vQ = {
      value: val,
      unit: "[mmol/L]",
      system: "http://loinc.org",
      code: "15074-8"
//      ,display: "Glucose in blood"
    }
    return vQ;
  }

  this.getCodeSt = function() {
    var code = { code: {
      coding: [ {
        system: "http://hl7.org/fhir/observation-category",
        code: "laboratory",
        display: "Laboratory"
      } ],
      text: "Laboratory"
    }
    }
    return code;
  }
  this.getGlucoseStandard = function(val) {
    var dateTime = new Date();
    var glucose = {
      resourceType: "Observation",
      status: "preliminary",
      category: [ {
        coding: [ {
          system: "http://hl7.org/fhir/observation-category",
          code: "laboratory",
          display: "Laboratory"
        } ] } ],
      code: {
        coding: [ {
          system: "http://loinc.org",
          code: "15074-8",
          display: "Glucose in blood"
        } ] },
        effectiveDateTime: "[2016-12-20T20:20:20.000Z]",
        valueQuantity: {
          value: val,
          unit: "[mmol/L]"
        }
      }
      return glucose;
  }

  this.getEntryFields = function() {
    var entryFields = [{
      key: 'weight',
      type: 'input',
      templateOptions: {
        type: 'number',
        label: 'Weight [kg]',
        placeholder: 200
      }
    }, {
      key: 'steps',
      type: 'input',
      templateOptions: {
        type: 'number',
        label: 'Steps',
        placeholder: 10000
      }
    }];
    return entryFields;
  }

  this.getFHIR = function() {
    var fhir = {
      weight: {
        name: "Gewicht",
        format: "fhir/Observation",
        subformat: "Quantity",
        content: "http://loinc.org 3141-9",
        data: {
          "resourceType": "Observation",
          "status": "preliminary",
          "category": {
            "coding": [{
              "system": "http://hl7.org/fhir/ValueSet/observation-category",
              "code": "vital-signs",
              "display": "Vital Signs"
            }]
          },
          "code": {
            "coding": [{
              "system": "http://loinc.org",
              "code": "3141-9",
              "display": "Body weight Measured"
            }]
          },
          "valueQuantity": {
            "unit": "kg",
            "system": "http://unitsofmeasure.org",
            "code": "kg"

          },
          $set: "data.valueQuantity.value"
        }
      }
      ,

      steps: {
        name: "Schritte",
        format: "fhir/Observation",
        subformat: "Quantity",
        content: "http://loing.org 55423-8",
        data: {
          "resourceType": "Observation",
          "status": "preliminary",
          "category": {
            "coding": [{
              "system": "http://hl7.org/fhir/ValueSet/observation-category",
              "code": "vital-signs",
              "display": "Vital Signs"
            }]
          },
          "code": {
            "coding": [{
              "system": "http://loinc.org",
              "code": "55423-8",
              "display": "Number of steps in unspecified time Pedometer"
            }]
          },
          "valueQuantity": {
            "unit": "steps",
            "system": "http://midata.coop",
            "code": "steps"
          },
          $set: "data.valueQuantity.value"
        }
      }
    };
    return fhir;
  }

  this.getFHIRGroup = function() {
    var fhirGroup = {
      name: "Gruppe",
      format: "fhir/Observation",
      subformat: "String",
      content: "http://loinc.org 61150-9",
      data: {
        "resourceType": "Observation",
        "status": "preliminary",
        "category": {
          "coding": [{
            "system": "http://hl7.org/fhir/ValueSet/observation-category",
            "code": "survey",
            "display": "Survey"
          }]
        },
        "code": {
          "coding": [{
            "system": "http://loinc.org",
            "code": "61150-9",
            "display": "Subjective Narrative"
          }]
        },
        $set: "valueString"
      }
    }
    return fhirGroup;
  }
});
