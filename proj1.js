// https://www.tutorialspoint.com/jquery/jquery-syntax.htm
// handling document ready event

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

function main() {

    const canvas = document.querySelector( '#threejs' );
    const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );

    //카메라 설정
    const near = 0.1;
    const far = 100;
    const size = 10;
    const camera = new THREE.OrthographicCamera(-size, size, size, -size, near, far);
    camera.position.set( 0, 10, 20 );
    
    const controls = new OrbitControls( camera, canvas );
    controls.target.set( 0, 5, 0 );
    controls.update();
    
    //씬 설정
    const scene = new THREE.Scene();
    scene.background = new THREE.Color( 'black' );
    
    //원통 객체 생성
    const geom = new THREE.CylinderGeometry(1,1,2,16);

    //씬에 3D 도형 추가
    const base = new THREE.Object3D();
    scene.add(base);

    //그리드 생성
    const grid_base = new THREE.GridHelper(30,30);
    grid_base.renderOrder = 1;
    scene.add(grid_base);


    //Geometry, Material로 Mesh 생성 후 3D base에 추가
    const mat_base = new THREE.MeshPhongMaterial( { color: "#888" } );
    const mesh_base = new THREE.Mesh(geom, mat_base);
    mesh_base.scale.set(1,0.5,1);
    base.add(mesh_base);

    base.position.y = mesh_base.scale.y;

    
    function createFinger(length,radius) {
        const fingerGeometry = new THREE.CylinderGeometry(radius,radius,length,16);
        const fingerMaterial = new THREE.MeshPhongMaterial({ color: "red" });
        const finger = new THREE.Mesh(fingerGeometry, fingerMaterial);
    
        return finger;
    }

    //엄지손가락
    function addThumbs(base) {
        const fingerLengths = [2.0,2.0] //기본 길이
        const radius=0.7 //기본 원 크기
        const base_x=-4.3 //기본 x 좌표
        const base_y=2.8 //기본 y 좌표

        for(let i=0;i<fingerLengths.length;i++){
            const fingerJoint=createFinger(fingerLengths[i],radius)
            fingerJoint.position.set(base_x, base_y+((i)*fingerLengths[i]), 0); // 손가락 위치 설정
            fingerJoint.rotation.z = Math.PI / 12
            if(i>=1){
                fingerJoint.position.set(base_x-(0.52*(i)),base_y+((i)*fingerLengths[i])-0.07, 0)
            }
            base.add(fingerJoint);
        }
    }

    //손목
    function addWrists(base) {
        const radius=1.2
        const fingerGeometry = new THREE.CylinderGeometry(radius,radius,6,16) 
        fingerGeometry.scale(3,1,0.8)
        const fingerMaterial = new THREE.MeshPhongMaterial({color:"red"})
        const finger = new THREE.Mesh(fingerGeometry,fingerMaterial)

        finger.position.set(0,3.5,0)
        base.add(finger)
    }

    function addRemainFingers(base) {
        const fingerLengths = [3.6,4.7,3.9,3.3]; // 손가락 길이
        const radius=0.65 // 기본 원 크기
        for (let i = 0; i < 4; i++) {
            for(let j=0; j<3; j++){
                const finger = createFinger(fingerLengths[i],radius);
                finger.position.set(-2.2 + i*1.5 , 7.5-(1.0-fingerLengths[i]/2)+j, 0); // 손가락 위치 설정
                base.add(finger);
            }
        }
    }

    addWrists(base)
    addThumbs(base)
    addRemainFingers(base)

    //변화가 감지될 때 실행
    function onChange(event, ui) {
        let id = event.target.id;

        document.querySelector("#log").innerHTML = "" + id + ": " + $("#" + id).slider("value");
    }

   
    
    {
    
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight( color, intensity );
        light.position.set( 0, 10, 0 );
        light.target.position.set( - 5, 0, 0 );
        scene.add( light );
        scene.add( light.target );
    
    }
    {
        const color = 0xFFFFFF;
        const intensity = 0.1;
        const light = new THREE.AmbientLight( color, intensity );
        scene.add( light );
    }
    
    //사이즈 변화시 실행
    function resizeRendererToDisplaySize( renderer ) {
    
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if ( needResize ) {
        
            renderer.setSize( width, height, false );
        
        }
        
        return needResize;
    
    }
    
    //렌더링 함수
    function render() {
    
        if ( resizeRendererToDisplaySize( renderer ) ) {
        
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        
        }
        
        renderer.render( scene, camera );
        
        requestAnimationFrame( render );
    
    }
    
    requestAnimationFrame( render );

    //슬라이더 조절
    let sliders = [
        {id:"slider-thumb-joint1",  orientation:"vertical",   min:0, max:45, value:0},
        {id:"slider-thumb-joint2",  orientation:"vertical",   min:0, max:45, value:0},
        {id:"slider-index-joint1",  orientation:"vertical",   min:0, max:45, value:0},
        {id:"slider-index-joint2",  orientation:"vertical",   min:0, max:45, value:0},
        {id:"slider-index-joint3",  orientation:"vertical",   min:0, max:45, value:0},
        {id:"slider-middle-joint1", orientation:"vertical",   min:0, max:45, value:0},
        {id:"slider-middle-joint2", orientation:"vertical",   min:0, max:45, value:0},
        {id:"slider-middle-joint3", orientation:"vertical",   min:0, max:45, value:0},
        {id:"slider-ring-joint1",   orientation:"vertical",   min:0, max:45, value:0},
        {id:"slider-ring-joint2",   orientation:"vertical",   min:0, max:45, value:0},
        {id:"slider-ring-joint3",   orientation:"vertical",   min:0, max:45, value:0},
        {id:"slider-small-joint1",  orientation:"vertical",   min:0, max:45, value:0},
        {id:"slider-small-joint2",  orientation:"vertical",   min:0, max:45, value:0},
        {id:"slider-small-joint3",  orientation:"vertical",   min:0, max:45, value:0},
        {id:"slider-wrist-bend",    orientation:"vertical",   min:-45, max:45, value:0},
        {id:"slider-fingers",       orientation:"horizontal", min:0, max:10, value:0},
        {id:"slider-wrist-twist",   orientation:"horizontal", min:0, max:360, value:0},
    ];

    for(let slider of sliders) {
        $( "#" + slider.id).slider({
          orientation: slider.orientation,
          range: "min",
          min: slider.min,
          max: slider.max,
          value: slider.value,
          slide: onChange,
        });
    }

}


main();

