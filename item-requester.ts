export function request_ingredients(produced_item: Value) {
    
    // Wait until recipe is set in the factory manager
    let manager_entity: Value;
    get_factory_block_manager_and_item(manager_entity,produced_item)

    let num_ingredients: number;
    num_ingredients = 0;
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
        for (let i = 1; i <= slots_per_ingredient; i = i + 1) {
            lockSlots(ingredient, current_slot)
            current_slot = current_slot + 1;
        }
    }

    //work: request necessary items
    while (num_slots == self.countStorageSlots()) {
        for (const ingredient of recipieIngredients(produced_item)) {
            requestItem(combineRegister(getMaxStack(ingredient) * slots_per_ingredient, ingredient));
            orderTransfer(manager_entity, combineRegister(getMaxStack(ingredient), ingredient));// push to manager
        }
    }
    notify("ERROR: number of slots changed");
}


function get_factory_block_manager_and_item(manager_entity: Value, produced_item: Value) {
    // Wait until a recipe is set on the factory manager
    // the factory block manager is the building nearby that emits a signal. Raises an error if more than one is found
    while (compareItem(produced_item, null)) {
        let local_produced_item: Value;
        for (const building of entitiesInRange(1, "v_building")) {
            local_produced_item = readSignal(building)
            if (!compareItem(local_produced_item, null)) {
                manager_entity = building;
                if (!compareItem(produced_item, null)) {
                    notify("ERROR: Multiple Factory Managers Found");
                }
                produced_item = local_produced_item;
            }
        }
    }
    return;
}
