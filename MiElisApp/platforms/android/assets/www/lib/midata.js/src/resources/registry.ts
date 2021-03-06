const registry: any = {};

export function registerResource(code: string) {
    return (cls: any) => {
        registry[code] = cls;
        w.cls = cls;
    };
};

/**
 * Create a resource with the type of the constructor
 * function `cls`.
 */
export function fromFhir(fhirObject: any) {
    let tryToMap = fhirObject.code !== undefined
                && fhirObject.code.coding !== undefined
                && fhirObject.code.coding.length == 1
                && fhirObject.code.coding[0].code !== undefined;
    if (tryToMap) {
        let coding = fhirObject.code.coding[0].code;
        let mappingExists = registry[coding] !== undefined;
        if (mappingExists) {
            let resource: any = {
                _fhir: fhirObject
            };
            let cls = registry[coding];
            resource.__proto__ = cls.prototype
            return resource;
        } else {
            return fhirObject;
        }
    } else {
        return fhirObject;
    }
}

let w = <any>window;
w.fromFhir = fromFhir;
