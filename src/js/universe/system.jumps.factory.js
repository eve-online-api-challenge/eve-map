function pack() {
    var keys = Object.keys(kspace);
    var i, systemId, l = keys.length;
    for (i = 0; i < l; i++) {
        systemId = keys[i];
        fudge(systemId);
    }
}

function fudge(systemId) {
    var system = kspace[systemId];
    var i, connectionId, l = system.connections.length;
    var total = 0;
    for (i = 0; i < l; i++) {
        connectionId = system.connections[i];
        total += kspace[connectionId].jumps || 0;
    }
    for (i = 0; i < l; i++) {
        connectionId = system.connections[i];
        var weighting = (kspace[connectionId].jumps || 0) / total;
        if (connections[systemId] !== undefined)
            fml(connections[systemId], connectionId, weighting);
        else if (connections[connectionId] !== undefined)
            fml(connections[connectionId], systemId, weighting);
        else {
            connections[systemId] = {};
            connections[systemId][connectionId] = weighting;
        }
    }
}

function fml(j, c, w) {
    if (j[c] !== undefined)
        j[c] = (j[c] + w) / 2;
    else
        j[c] = w;
}