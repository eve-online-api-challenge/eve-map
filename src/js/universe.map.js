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
        initializeCamera();
        resetCameraPosition();
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
        var material = new THREE.PointsMaterial({ size: 1 });
        var keys = Object.keys(universe.systems);
        var i, l = keys.length;
        for (i = 0; i < l; i++) {
            var vertex = new THREE.Vector3();
            var system = universe.systems[keys[i]];
            vertex.set(system.x, system.y, system.z);
            geometry.vertices.push(vertex);
        }
        return new THREE.Points(geometry, material);
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