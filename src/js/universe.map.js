function UniverseMap(universe) {
    var screenWidth = window.innerWidth;
    var screenHeight = window.innerHeight;
    var aspectRatio = screenWidth / screenHeight;
    var radialCamera, scene;
    var container = document.getElementById('systemView');
    var renderer = new THREE.WebGLRenderer();
    var controls;
    renderer.setSize(screenWidth, screenHeight);
    container.appendChild(renderer.domElement);

    this.initialize = function initialize() {
        scene = new THREE.Scene();
        var systems = initializeUniverse();
        radialCamera = new RadialCamera();
        radialCamera.initialize();
        scene.add(systems);
        scene.add(radialCamera.camera);
    };

    this.render = function render() {
        requestAnimationFrame(render);
        controls.update();
        renderer.render(scene, radialCamera.camera);
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

    function RadialCamera() {
        var self = this;
        const fov = 50;
        const limitNear = 0.1;
        const limitFar = Number.MAX_SAFE_INTEGER;
        var x, y, z, radius;
        this.camera = new THREE.PerspectiveCamera(fov, aspectRatio, limitNear, limitFar);

        this.initialize = function initializeCamera() {
            x = (universe.limits.xMin + universe.limits.xMax) / 2;
            y = (universe.limits.yMin + universe.limits.yMax) / 2;
            z = (universe.limits.zMin + universe.limits.zMax) / 2;
            radius = universe.limits.zMax * 3;
            self.camera.position.y = radius;
            controls = new THREE.TrackballControls(self.camera, renderer.domElement);
            controls.minDistance = radius / 10;
            controls.maxDistance = radius * 2;
            controls.target = new THREE.Vector3(x, y, z);
            controls.rotateSpeed = 8;
            controls.zoomSpeed = 5;
        }
    }
}