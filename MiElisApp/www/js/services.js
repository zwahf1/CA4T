angular.module('services', [])

.service('json',function() {

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
