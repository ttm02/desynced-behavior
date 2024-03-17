export function reserve_storage(item: Value) {

       // Wait until recipe is set in the factory manager
    let manager_entity: Value;
    get_factory_block_manager_and_item(manager_entity,item)
    
    lockSlots(item, null);
    exit();
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
