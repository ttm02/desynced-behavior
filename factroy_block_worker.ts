export function factory_block_worker(produced_item: Value) {

    // Wait until recipe is set in the factory manager
    let manager_entity: Value;
    get_factory_block_manager_and_item(manager_entity,produced_item)

    // get production component from network    
    let component: Value;
    get_producing_component(produced_item,component);

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

    lock_items_for_production(produced_item);

    // work: push production result to manager
    while(true){
                orderTransfer(manager_entity, combineRegister(getMaxStack(produced_item), produced_item));// push to manager
                }
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


function lock_items_for_production(produced_item){
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
        for (var i=1; i <= slots_per_ingredient; i = i + 1) {
            lockSlots(ingredient, current_slot);
            current_slot = current_slot + 1
        }
    }
    // for the result
    for (var i=1; i <= slots_per_ingredient; i = i + 1) {
        lockSlots(produced_item, current_slot);
        current_slot = current_slot + 1
    }
}

function get_producing_component(produced_item: Value,component:Value) {

    component = value("c_robotics_factory",1);
    if (canProduce(produced_item, component)) {
        return;
    }       
    component = value("c_assembler",1);
    if (canProduce(produced_item, component)) {
        return;
    }

    component = value("c_fabricator",1);
    if (canProduce(produced_item, component)) {
        return;
    }
    component = value("c_refinery",1);
    if (canProduce(produced_item, component)) {
    return;
    }

    notify("ERROR: Dont know where to produce item");    
    return;

}
