import { z } from "zod";

export const Constraints = {
    positiveNumber: (any) => catchFunction(() => !isNaN(z.number().nonnegative().parse(any))),
    positiveInt: (any) => catchFunction(() =>  !isNaN(z.number().nonnegative().int().parse(any))),
    email: (any) => catchFunction(() => z.string().email().parse(any)),
    url: (any) => catchFunction(() => z.string().url().parse(any)),
    string: (any) => catchFunction(() => z.string().parse(any)),
    percentage: (any) => catchFunction(() => !isNaN(z.number().nonnegative().lte(100).parse(any))),
    date: (any) => catchFunction(() => z.date().parse(any))
}



/**
 * @template T 
 * @param {() => T} someFunction 
 * @returns {T | undefined}
 */
function catchFunction(someFunction){
    try{
        return someFunction()
    } catch(_){
        return undefined;
    }
}
