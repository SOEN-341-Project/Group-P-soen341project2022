import hasRequiredBrandCreationParams from "../src/helpers/verifyBrandCreation";

const data = ["name", "description"];
const requestBody: any = { name: 'name', description: 'description'};

describe("Required Brand Creation Params Tests", () => {
    test("No name", () => {
        requestBody.name = undefined;
        requestBody.description = data[1];

        expect(hasRequiredBrandCreationParams(requestBody)).toEqual(false);
    });

    test("No description, still valid", () => {
        requestBody.name = data[0];
        requestBody.description = undefined;

        expect(hasRequiredBrandCreationParams(requestBody)).toEqual(true);
    });

    test("Nothing at all", () => {
        requestBody.name = undefined;
        requestBody.description = undefined;

        expect(hasRequiredBrandCreationParams(requestBody)).toEqual(false);
    });

    test("Valid, good to create brand", () => {
        requestBody.name = data[0];
        requestBody.description = data[1];

        expect(hasRequiredBrandCreationParams(requestBody)).toEqual(true);
    });

});
