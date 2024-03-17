export function reserve_storage(item: Value) {

    // Wait until item is set
    while (compareItem(item, null)) {
        // try to read item from surrounding buildings
        // e.g. the factroy block manager, as no other entitiy in range will set their signal register
        for (const building of entitiesInRange(1, "v_building")) { 
            item = readSignal(building)
        }
    }
    lockSlots(item, null);
    exit();
}
