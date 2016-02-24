function System(screenWidth, screenHeight, systems) {
    function init() {
        var container = document.getElementById('systemView');
    }
    function initView() {
        var fov = 50;
        var aspectRatio = screenWidth / screenHeight;
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(fov, aspectRatio, NEAR, FAR);
        scene.add(camera);
    }
}