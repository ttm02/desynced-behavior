export function request_ingredients(produced_item: Value) {

    let num_ingredients: number;
    num_ingredients = 1;//or 2 to leave more space for the produced item?
    for (const ingredient of recipieIngredients(produced_item)) { num_ingredients = num_ingredients + 1; }


    let num_slots: number;
    num_slots = self.countStorageSlots();

    let slots_per_ingredient: number = num_slots / num_ingredients;
    if (slots_per_ingredient == 0) {
        notify("ERROR: not enough slots for ingredients");
        return;
    }

    // setup: lock the slots
    let current_slot: number = 1;
    for (const ingredient of recipieIngredients(produced_item)) {
        for (let i = 1; 1 <= slots_per_ingredient; i = i + 1) {
            lockSlots(ingredient, current_slot)
            current_slot = current_slot + 1;
        }
    }

    //work: request necessary items
    while (num_slots == self.countStorageSlots()) {
        for (const ingredient of recipieIngredients(produced_item)) {
            requestItem(combineRegister(getMaxStack(ingredient) * slots_per_ingredient, ingredient));
        }
    }
    notify("ERROR: number of slots changed");
}
