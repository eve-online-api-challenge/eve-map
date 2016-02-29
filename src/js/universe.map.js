function UniverseMap(universe) {
    var screenWidth = window.innerWidth;
    var screenHeight = window.innerHeight;
    var aspectRatio = screenWidth / screenHeight;
    var camera, scene;
    var container = document.getElementById('systemView');
    var renderer = new THREE.WebGLRenderer();
    var controls;
    renderer.setSize(screenWidth, screenHeight);
    container.appendChild(renderer.domElement);

    this.initialize = function initialize() {
        scene = new THREE.Scene();
        var systems = initializeUniverse();
        var connections = initializeConnections();
        initializeCamera();
        resetCameraPosition();
        scene.add(connections);
        scene.add(systems);
        
        scene.add(camera);
    };

    this.render = function render() {
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    function initializeUniverse() {
        var geometry = new THREE.Geometry();
        var material = new THREE.PointsMaterial({ size: 3000000000000000, color:0xff4d4d });
        var keys = Object.keys(universe.systems);

        for (var i = 0, l = keys.length; i < l; i++) {
            var vertex = new THREE.Vector3();
            var system = universe.systems[keys[i]];
            vertex.set(system.x, system.y, system.z);
            geometry.vertices.push(vertex);
        }
        return new THREE.Points(geometry, material);
    }

    function initializeConnections() {
        var material = new THREE.LineBasicMaterial({ color: 0x595959 });
        var geometry = new THREE.Geometry();
        var connections = universe.connections;
        var systems = universe.systems;
        var keys = Object.keys(connections);

        for (var i = 0, l = keys.length; i < l; i++) {
            var systemID = keys[i];
            var connectionIds = universe.connections[systemID];
            var from = systems[systemID];
            for (var j = 0, m = connectionIds.length; j < m; j++) {
                var connectionId = connectionIds[j];
                var to = systems[connectionId];
                geometry.vertices.push(new THREE.Vector3(from.x, from.y, from.z));
                geometry.vertices.push(new THREE.Vector3(to.x, to.y, to.z));
            }
        }
        return new THREE.LineSegments(geometry, material);
    }

    function initializeCamera() {
        const fov = 50;
        const limitNear = 1;
        const limitFar = Number.MAX_SAFE_INTEGER;
        camera = new THREE.PerspectiveCamera(fov, aspectRatio, limitNear, limitFar);
        controls = new THREE.TrackballControls(camera, renderer.domElement);
        controls.rotateSpeed = 8;
        controls.zoomSpeed = 5;
    }

    function resetCameraPosition() {
        var x, y, z;
        x = (universe.limits.xMin + universe.limits.xMax) / 2;
        y = (universe.limits.yMin + universe.limits.yMax) / 2;
        z = (universe.limits.zMin + universe.limits.zMax) / 2;

        var radius = Math.abs(universe.limits.xMin - x);
        radius = returnGreater(Math.abs(universe.limits.xMax - x), radius);
        radius = returnGreater(Math.abs(universe.limits.yMin - y), radius);
        radius = returnGreater(Math.abs(universe.limits.yMax - y), radius);
        radius = returnGreater(Math.abs(universe.limits.zMin - z), radius);
        radius = returnGreater(Math.abs(universe.limits.zMax - z), radius);

        var cameraMaxRadius = radius * 5;
        var cameraMinRadius = radius / 10;
        camera.position.y = radius * 3;
        controls.minDistance = cameraMinRadius;
        controls.maxDistance = cameraMaxRadius;
        controls.target = new THREE.Vector3(x, y, z);

        function returnGreater(oldValue, newValue) {
            if (newValue > oldValue)
                return newValue;
            else
                return oldValue;
        }
    }
}