export function factory_block_manager(produced_item: Value) {

    // Wait until recipe is set
    while (compareItem(produced_item, null)) {
        wait(10);
    }


    // build workers
    let position:Value = getLocation(self);
    // left
    let new_pos:Value = position - coord(2, 0);
    build_factory_worker(new_pos, 1);
    new_pos = new_pos - coord(0, 1);
    build_factory_worker(new_pos, 1);
    new_pos = new_pos - coord(0, 1);
    build_factory_worker(new_pos, 1);
    //right
    new_pos = position + coord(1, 0);
    build_factory_worker(new_pos, 3);
    new_pos = new_pos - coord(0, 1);
    build_factory_worker(new_pos, 3);
    new_pos = new_pos - coord(0, 1);
    build_factory_worker(new_pos, 3);
    // top
    new_pos = position - coord(0, 3);
    build_factory_worker(new_pos, 4);
    // build in, out Storages and power station in between those
    new_pos = position + coord(0, 1);
    build_power_station(new_pos, 4);
    new_pos = new_pos - coord(1, 0);
    build_factory_storage_in(new_pos, 4);
    new_pos = new_pos + coord(2, 0);
    build_factory_storage_out(new_pos, 4);
    
    // end setup of other required buildings
    
    // setup of inventory slots
    lock_items_for_production(produced_item);
    
    //work: handle in-factory logistic
    const [my_x_pos,my_y_pos] = separateCoordinate(position)
    let num_slots = self.countStorageSlots();
    while (num_slots == self.countStorageSlots()) {
    for (const building of entitiesInRange(1, "v_building")) {
        const [their_x_pos,their_y_pos] = separateCoordinate(getLocation(building))
        // storage has larger y position than the manager (>= is a worker)
        for (const ingredient of recipieIngredients(produced_item)) {
             if(my_y_pos<= their_	y_pos){
                // worker 
                orderTransfer(building, combineRegister(getMaxStack(ingredient), ingredient))
             }
             else{
                //storage
             }
        }
        if(my_y_pos<= their_y_pos){
                // worker 
             }
             else{
                //storage
                orderTransfer(building, combineRegister(getMaxStack(produced_item), produced_item))
             }
        }
    }
    notify("ERROR: number of slots changed");
    exit();
}


// need to setup the correct blueprints for the buildings to build in-game
function build_factory_worker(position: Value, rotation: number) {
    build(position, rotation);
}

// need to setup the correct blueprints for the buildings to build in-game
function build_factory_storage_in(position: Value, rotation: number) {
    build(position, rotation);
}

// need to setup the correct blueprints for the buildings to build in-game
function build_factory_storage_out(position: Value, rotation: number) {
    build(position, rotation);
}

// need to setup the correct blueprints for the buildings to build in-game
function build_power_station(position: Value, rotation: number) {
    build(position, rotation);
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

