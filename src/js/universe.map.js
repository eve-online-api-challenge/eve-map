function UniverseMap(universe) {
    //container
    var container = document.getElementById('universe-map');
    var containerWidth, containerHeight, aspectRatio;
    var renderer = new THREE.WebGLRenderer();
    
    //scene
    var camera, scene;
    
    //controls
    var controls;
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();

    this.render = function render() {
        requestAnimationFrame(render);
        raycaster.setFromCamera(mouse, camera);
        // var intersects = raycaster.intersectObjects(scene.children);
        // if (intersects[0]) console.log(intersects[0].point);
        renderer.render(scene, camera);
        controls.update();
    }

    this.initialize = function initialize() {
        container.appendChild(renderer.domElement);
        containerWidth = window.innerWidth;
        containerHeight = window.innerHeight;
        aspectRatio = containerWidth / containerHeight;
        renderer.setSize(containerWidth, containerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.addEventListener('mousemove', onMouseMove, false);
        initializeCamera();
        initializeControls();
        scene = new THREE.Scene();
        addSolarSystems();
        initializeGateConnections();
        scene.add(camera);
    };

    function addSolarSystems() {
        var geometry = new THREE.Geometry();
        var color = new THREE.Color(0x895959);
        var keys = Object.keys(universe.systems);

        for (var i = 0, l = keys.length; i < l; i++) {
            var system = universe.systems[keys[i]];
            var v = new THREE.Vector3(system.x, system.y, system.z);
            geometry.colors.push(color);
            geometry.vertices.push(v);
        }
        
        geometry.computeBoundingBox();
        var pointSize;
        pointSize = 50 + Math.sqrt(1 / keys.length) * 1800;
        console.log(keys.length, pointSize);

        var material = new THREE.PointsMaterial({ vertexColors: THREE.VertexColors, size: pointSize });
        //trying system size as param multiplied by fudge factor...
        raycaster.params.Points.threshold = pointSize / 2;
        scene.add(new THREE.Points(geometry, material));
    }

    function initializeGateConnections() {
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
        scene.add(new THREE.LineSegments(geometry, material));
    }

    function initializeCamera() {
        const fov = 50;
        const limitNear = 1;
        const limitFar = Number.MAX_SAFE_INTEGER;
        camera = new THREE.PerspectiveCamera(fov, aspectRatio, limitNear, limitFar);
        camera.position.y = universe.limits.radius * 3;
    }

    function initializeControls() {
        controls = new THREE.TrackballControls(camera, renderer.domElement);
        controls.rotateSpeed = 3.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;
        controls.object.up.copy(new THREE.Vector3(1, 0, 0));
        controls.minDistance = universe.limits.radius / 10;
        controls.maxDistance = universe.limits.radius * 5;
        controls.target = new THREE.Vector3(universe.limits.x, universe.limits.y, universe.limits.z);
    }

    function onMouseMove(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    }
}