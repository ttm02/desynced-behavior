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
    new_pos = position - coord(0, 4);
    build_factory_worker(new_pos, 4);
    // build in, out Storages and power station in between those
    new_pos = position + coord(0, 1);
    build_power_station(new_pos, 4);
    new_pos = position - coord(0, 1);
    build_factory_storage_in(new_pos, 4);
    new_pos = position + coord(0, 2);
    build_factory_storage_out(new_pos, 4);
    
    // end setup of other required buildings
    
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

