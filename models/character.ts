import { type InferInput, minLength, object, pipe, string } from "valibot";

export const CharacterSchema = object({
    name: pipe(string(), minLength(6)),
    lastName: pipe(string(), minLength(6))
})
export type Character = InferInput<typeof CharacterSchema> & {
    id: number
};

const characters: Map<number, Character> = new Map();

/**
 * Retrieves all characters from the collection.
 * @returns {Character[]} An array of all characters.
 */
export const getAllCharacters = (): Character[] => {
    return Array.from(characters.values());
}

/**
 * 
 * @param id - The ID of the character to retrieve.
 * @returns {Character | undefined} The character with the specified ID, or undefined if not found.
 */

export const getCharacterById = (id:number): Character|undefined =>{
    return characters.get(id)
}

/**
 * Adds a new character to the collection.
 * @param {Character} character - The character to add.
 * @returns {Character} The newly added character with a generated ID.
 */
export const addCharacter = (character: Character): Character => {
    if(character.id && !characters.has(character.id)){
        console.error('Character with id', character.id, 'already exists');
        return character;
    }
    const newCharacter = { ...character, id: Date.now() };
    characters.set(newCharacter.id, newCharacter);
    return newCharacter;
}

/**
 * Updates an existing character in the collection.
 * @param {number} id - The ID of the character to update.
 * @param {Character} updateCharacter - The updated character data.
 * @returns {Character | null} The updated character, or null if the character was not found.
 */
export const updateCharacter = (id: number, updateCharacter: Character): Character | null => {
    if (!characters.has(id)) {
        console.error('Character with id', id, 'not found');
        return null;
    }
    characters.set(id, updateCharacter);
    return updateCharacter;
}

/**
 * Deletes a character from the collection.
 * @param {number} id - The ID of the character to delete.
 * @returns {boolean} True if the character was deleted, false if the character was not found.
 */
export const deleteCharacter = (id: number): boolean => {
    if (!characters.has(id)) {
        console.error('Character with id', id, 'not found');
        return false;
    }
    characters.delete(id);
    return true;
}
