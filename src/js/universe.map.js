function UniverseMap(universe) {
    //container
    var container = document.getElementById('systemView');
    var screenWidth = window.innerWidth;
    var screenHeight = window.innerHeight;
    var aspectRatio = screenWidth / screenHeight;
    
    //renderer
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(screenWidth, screenHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    //scene
    var universeRadius, universeX, universeY, universeZ;
    var camera, scene;
    
    //controls
    var controls;
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();

    this.initialize = function initialize() {
        container.appendChild(renderer.domElement);
        document.addEventListener('mousemove', onMouseMove, false);
        calculateSystemGeometry();
        initializeCamera();
        initializeControls();
        scene = new THREE.Scene();
        initializeUniverse();
        scene.add(camera);
    };

    function initializeUniverse() {
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
        var pointSize = universeRadius / keys.length * 100;
        var material = new THREE.PointsMaterial({ vertexColors: THREE.VertexColors, size: pointSize });
        //trying system size as param multiplied by fudge factor...
        raycaster.params.Points.threshold = pointSize / 2;
        scene.add(new THREE.Points(geometry, material));
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
    }

    function initializeControls() {
        controls = new THREE.TrackballControls(camera, renderer.domElement);
        controls.rotateSpeed = 8;
        controls.zoomSpeed = 5;
        controls.object.up.copy(new THREE.Vector3(1, 0, 0));
        controls.minDistance = universeRadius * 5;
        controls.maxDistance = universeRadius / 10;
        controls.target = new THREE.Vector3(universeX, universeY, universeZ);
    }

    function calculateSystemGeometry() {
        universeX = (universe.limits.xMin + universe.limits.xMax) / 2;
        universeY = (universe.limits.yMin + universe.limits.yMax) / 2;
        universeZ = (universe.limits.zMin + universe.limits.zMax) / 2;

        universeRadius = Math.abs(universe.limits.xMin - universeX);
        universeRadius = returnGreater(Math.abs(universe.limits.xMax - universeX), universeRadius);
        universeRadius = returnGreater(Math.abs(universe.limits.yMin - universeY), universeRadius);
        universeRadius = returnGreater(Math.abs(universe.limits.yMax - universeY), universeRadius);
        universeRadius = returnGreater(Math.abs(universe.limits.zMin - universeZ), universeRadius);
        universeRadius = returnGreater(Math.abs(universe.limits.zMax - universeZ), universeRadius);
        function returnGreater(oldValue, newValue) {
            if (newValue > oldValue)
                return newValue;
            else
                return oldValue;
        }
    }

    function onMouseMove(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    }

    this.render = function render() {
        requestAnimationFrame(render);
        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObjects(scene.children);
        if (intersects[0]) console.log(intersects[0].point)
        renderer.render(scene, camera);
        controls.update();
    }
}