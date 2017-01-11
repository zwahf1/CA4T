angular.module('services', [])

.service('midataService',function() {

  var app = {
    server: 'https://test.midata.coop:9000',
    appname: 'MiElisApp',
    appsecret: 'MEA2016HSCA4T'
  }

  var md = new midata.Midata(app.server, app.appname, app.appsecret);

// Login with username and password from
//  user: json
  this.login = function(user) {
    md.login(user.User, user.Password)
    .then(function() {
        console.log('Logged in!');
    });
  }

// Logout from actual account
  this.logout = function() {
    md.logout();
    console.log("logged out");
  }

// retun boolean for actual state
//  true: if logged in, otherwise false
  this.loggedIn = function() {
    return md.loggedIn;
  }

//******************************************************************************
// functions for save vital signs and laboratory with given parameters
// saveWeight(w, d)
//    w: weight [kg]
//    d: datetime
// saveBloodPressure(sys, dia, d)
//    sys: systolic blood pressure [mmHg]
//    dia: diastolic blood pressure [mmHg]
//    d: datetime
// savePulse(p, d)
//    p: pulse [beats/min]
//    d: datetime
// saveGlucose(g, d)
//    g: glucose [mmol/l]
//    d: datetime
//******************************************************************************
  this.saveWeight = function(w, d) {
    return md.save(this.getJSONWeight(w, d));
  }

  this.saveBloodPressure = function(sys, dia, d) {
    return md.save(this.getJSONBloodPressure(sys, dia, d));
  }

  this.savePulse = function(p, d) {
    return md.save(this.getJSONPulse(p, d));
  }

  this.saveGlucose = function(g, d) {
    return md.save(this.getGlucoseStandard(g, d));
  }
// search ressources on MIDATA connection with given aprameters
//    res: string
//      example: "Person" or "Observation"
//    params: json, empty if all
//      example: {}, {valueQuantity: 100}
  this.search = function(res,params) {
    return md.search(res,params);
  }

//******************************************************************************
//get the created JSON files with the given parameters
// - glucose: --> getGlucoseStandard(g,d)
//    g:Glucose, d:Date
// - weight: --> getJSONWeight(w,d)
//    w:Weight, d:Date
// - pulse: --> getJSONPulse(p,d)
//    p:Pulse, d:Date
// - blood pressure: --> getJSONBloodPressure(sys,dia,d)
//    sys:Systolic BP, dia:Diastolic BP, d:Date

//------------------------------------------------------------------------------
//                    json for glucose [mmol/l]
//------------------------------------------------------------------------------
  this.getGlucoseStandard = function(g, d) {
    var data = {
        resourceType: 'Observation',
        status: "preliminary",
        code: {
          text: "Glukose",
          coding: [ {
            system: 'http://loinc.org',
            code: '15074-8',
            display: 'Glucose [Moles/volume] in blood'
          } ]
        },
        effectiveDateTime: d,
        category: {
          coding: [ {
              system: "http://hl7.org/fhir/observation-category",
              code: "laboratory",
              display: "Laboratory"
            } ]
        },
        valueQuantity: {
          value: g,
          unit: 'mmol/l',
          system: 'http://unitsofmeasure.org'
        }
      };
      return data;
  }

//------------------------------------------------------------------------------
//                    json for weight [kg]
//------------------------------------------------------------------------------
  this.getJSONWeight = function(w, d) {
    var data = {
      resourceType: 'Observation',
      status: "preliminary",
      code: {
        text: "Gewicht",
        coding: [{
          system: 'http://loinc.org',
          code: '3141-9',
          display: 'Weight Measured'
        }]
      },
      effectiveDateTime: d,
      category: {
        coding: [ {
            system: "http://hl7.org/fhir/observation-category",
            code: "vital-signs",
            display: "Vital-Signs"
        } ]
      },
      valueQuantity: {
        value: w,
        unit: 'kg',
        system: 'http://unitsofmeasure.org'
      }
    };
    return data;
  }

//------------------------------------------------------------------------------
//                    json for pulse [beats/min]
//------------------------------------------------------------------------------
  this.getJSONPulse = function(p, d) {
    var data = {
        resourceType: "Observation",
        status: "preliminary",
        code: {
          text: "Herzfrequenz",
          coding: [ {
              system: "http://loinc.org",
              display: "Herzfrequenz",
              code: "8867-4"
          } ]
        },
        effectiveDateTime: d,
        category: {
          coding: [ {
              system: "http://hl7.org/fhir/observation-category",
              code: "vital-signs",
              display: "Vital Signs"
          } ],
        },
        valueQuantity: {
          unit: "bpm",
          value: p
        }
    }
    return data;
  }

//------------------------------------------------------------------------------
//                    json for blood pressure [mmHg]
//------------------------------------------------------------------------------
  this.getJSONBloodPressure = function(sys, dia, d) {
    var data = {
      	resourceType: "Observation",
      	status: "preliminary",
      	code: {
      		text: "Blutdruck",
      		coding: [ {
      				system: "http://loinc.org",
      				display: "Blood Pressure",
      				code: "55417-0"
      		} ]
      	},
      	effectiveDateTime: d,
      	category: {
      		coding: [ {
      				system: "http://hl7.org/fhir/observation-category",
      				code: "vital-signs",
      				display: "Vital Signs"
      		} ],
      	},
      	component: [
          {
      			code: {
      				text: "Systolic blood pressure",
      				coding: [	{
      						system: "http://loinc.org",
      						display: "Systolic blood pressure",
      						code: "8480-6"
      				}	]
      			},
      			valueQuantity: {
      				unit: "mmHg",
      				value: sys
      			}
      		},
      		{
      			code: {
      				text: "Diastolic blood pressure",
      				coding: [ {
      						system: "http://loinc.org",
      						display: "Diastolic blood pressure",
      						code: "8462-4"
      				} ]
      			},
      			valueQuantity: {
      				unit: "mmHg",
      				value: dia
      			}
      		}
      	]
      }
    return data;
  }
});
