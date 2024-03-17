export function factory_block_worker(produced_item: Value) {

    // Wait until recipe is set
    let manager_entity: Value;// the factory block manager (aka the building nearby that emits a signal)

    while (compareItem(produced_item, null)) {
        // try to read item from surrounding buildings
        // e.g. the factroy block manager, as no other entitiy in range will set their signal register
        for (const building of entitiesInRange(1, "v_building")) {
            produced_item = readSignal(building)
            if (!compareItem(produced_item, null)) {
                manager_entity = building;
            }
        }
    }

    // get production component from network    
    let component: Value = get_producing_component(produced_item)
    connect();
    requestItem(combineRegister(2, component));
    while (self.count(component) < 2) {
        wait(10); // wait for components to arrive
    }

    // equip both
    if (!equip(component)) {
        notify("ERROR: Could not equip");
        return;
    }
    if (!equip(component)) {
        notify("ERROR: Could not equip");
        return;
    }
    disconnect();// the factory block manager will take care of the logistics

    let num_ingredients: number;
    num_ingredients = 1; // 1 for the production result
    for (const ingredient of recipieIngredients(produced_item)) { num_ingredients = num_ingredients + 1; }


    let num_slots: number;
    num_slots = self.countStorageSlots();

    let slots_per_ingredient: number = num_slots / num_ingredients;
    if (slots_per_ingredient == 0) {
        notify("ERROR: not enough slots for ingredients");
        return;
    }

    // lock relevant slots    
    let current_slot = 1;
    for (const ingredient of recipieIngredients(produced_item)) {
        for (var i; i <= slots_per_ingredient; i = i + 1) {
            lockSlots(ingredient, 1);
            current_slot = current_slot + 1
        }
    }
    // for the result
    for (var i; i <= slots_per_ingredient; i = i + 1) {
        lockSlots(produced_item, 1);
        current_slot = current_slot + 1
    }

    // the rest is handled by the factory block manager
}

function get_producing_component(produced_item: Value) {

    let component: Value = "c_robotics_factory";
    if (canProduce(produced_item, component)) {
        return component;
    }
    /*
    component: Item = combineRegister(1,"c_assembler");
    if (canProduce(produced_item, component)) {
        return component;
    }
    component: Item = combineRegister(1,"c_fabricator");
    if (canProduce(produced_item, component)) {
        return component;
    }
    component: Item = combineRegister(1,"c_refinery");
    if (canProduce(produced_item, component)) {
        return component;
    }
*/
    notify("ERROR: Dont know where to produce item");
    return;

}
