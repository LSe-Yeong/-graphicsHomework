// https://www.tutorialspoint.com/jquery/jquery-syntax.htm
// handling document ready event

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

function main() {

    const canvas = document.querySelector( '#threejs' );
    const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );

    //Object3D 객체 선언
    const wrist = new THREE.Object3D();
    const thumbJoint=[new THREE.Object3D(),new THREE.Object3D()]
    const fJoint=[new THREE.Object3D(),new THREE.Object3D(),new THREE.Object3D()]
    const sJoint=[new THREE.Object3D(),new THREE.Object3D(),new THREE.Object3D()]
    const tJoint=[new THREE.Object3D(),new THREE.Object3D(),new THREE.Object3D()]
    const lJoint=[new THREE.Object3D(),new THREE.Object3D(),new THREE.Object3D()]
    let thumb1Distance=0
    let thumb1Height=0

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
            thumbJoint[i].add(fingerJoint)
            if(i>=1){
                fingerJoint.position.set(base_x-(0.52*(i)),base_y+((i)*fingerLengths[i])-0.07, 0)
                thumb1Distance=Math.sqrt(Math.pow(base_x-(0.52*(i)),2) + Math.pow(base_y+((i)*fingerLengths[i])-0.07,2))
                thumb1Height=base_y+((i)*fingerLengths[i])-0.07
                thumbJoint[i-1].add(thumbJoint[i])
            }
            meshList.push(fingerJoint)
        }
        wrist.add(thumbJoint[0])
    }

    //손목
    function addWrists(base) {
        const radius=1.2
        const fingerGeometry = new THREE.CylinderGeometry(radius,radius,6,16) 
        fingerGeometry.scale(3,1,0.8)
        const fingerMaterial = new THREE.MeshPhongMaterial({color:"red"})
        const finger = new THREE.Mesh(fingerGeometry,fingerMaterial)
        finger.position.set(0,3.5,0)
        wrist.add(finger)
        base.add(wrist)
        meshList.push(finger)
    }

    function addRemainFingers(base) {
        const fingerLength = 2.0; // 손가락 길이
        const radius=0.65 // 기본 원 크기
        const joints=[fJoint,sJoint,tJoint,lJoint]

        for (let i = 0; i < 4; i++) {
            for(let j=0; j < 2; j++){
                const finger = createFinger(fingerLength,radius);
                finger.position.set(-2.2 + i*1.5 , 7.5 +j*2 , 0); // 손가락 위치 설정
                joints[i][j].add(finger)
                if(j>=1){
                    joints[i][j-1].add(joints[i][j])
                }
                meshList.push(finger)
            }
            wrist.add(joints[i][0])
        }
        // const fingerLengths=[2.0,2.5,2.2,1.9]
        const fingerLengths=[2.4,3.4,2.7,1.2]
        for (let i=0;i<4;i++){
            const finger = createFinger(fingerLengths[i],radius);
            finger.position.set(-2.2 + i*1.5 , 10.5 + (fingerLengths[i]/2) , 0); // 손가락 위치 설정
            joints[i][2].add(finger)
            joints[i][1].add(joints[i][2])
            meshList.push(finger)
        }
    }
    
    function makeGroup(meshList){
        /*
        0: 손목
        1,2 : 엄지
        3,4 : 검지
        5,6 : 중지
        7,8 : 약지
        9,10 : 새끼
        11 : 검지 끝
        12 : 중지 끝
        13 : 약지 끝
        14 : 새끼 끝 
        */
       

    }

    const meshList=[]

    addWrists(base)
    addThumbs(base)
    addRemainFingers(base)

    // thumbJoint[1].rotateOnAxis(new THREE.Vector3(1,-0.8,0),-Math.PI / 3)
    // // 원통 생성
    // const geometry = new THREE.CylinderGeometry(1, 1, 5, 32);
    // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    // const cylinder = new THREE.Mesh(geometry, material);

    // // 피벗 객체 생성
    // const pivot = new THREE.Object3D();
    // scene.add(pivot);
    // pivot.position.set(-10.5, 5.5, 0); // 좌측 하단을 기준점으로 설정
    // pivot.add(cylinder); // 원통을 피벗에 추가

    // const group = makeGroup(meshList)
    // meshList[7].rotation.x = Math.PI / 12
    // meshList[8].rotation.x = Math.PI / 12

    // tJoint[0].rotation.x = Math.PI / 48
    // tJoint[1].rotation.x = Math.PI / 24

    // fJoint[0].rotation.x = Math.PI / 12
    // 나머지 구현 방법
    // -------------------------------------------------------------------------------------------------------------
    // add 함수에서 리턴 값으로 Mesh 객체 리스트를 받는다.
    // 3D OBJECT를 통해 부모 자식 관계를 생성해준다.
    // 영향이 온다면 그 key 값 즉 이름과 매칭을 하여 같은 것이 발견되면 그 안에 있는 그룹 리스트에 대하여 rotation을 취해준다.

    //변화가 감지될 때 실행
    function onChange(event, ui) {
        let id = event.target.id;
        let radianValue = $("#" + id).slider("value") * Math.PI / 360
        if(id === "slider-wrist-twist"){
            wrist.rotation.y = radianValue
        }
        else if(id === "slider-wrist-bend"){
            wrist.rotation.x = -radianValue
        }
        else if(id === "slider-fingers"){
            thumbJoint[0].rotation.z = radianValue*3.0
            // thumbJoint[0].position.y = radianValue*20
            thumbJoint[0].position.x = radianValue*4.0

            fJoint[0].rotation.z = radianValue*2.0
            // fJoint[0].position.y = radianValue*12
            fJoint[0].position.x = radianValue*11

            sJoint[0].rotation.z = radianValue*1.0
            sJoint[0].position.x = radianValue*5

            tJoint[0].rotation.z = -radianValue*1.5
            tJoint[0].position.x = -radianValue*10

            lJoint[0].rotation.z = -radianValue*2.0
            lJoint[0].position.x = -radianValue*12
            // lJoint[0].position.y = radianValue*12
        }
        //엄지
        else if(id === "slider-thumb-joint2"){
            thumbJoint[0].rotation.x = -radianValue
            thumbJoint[0].position.y = radianValue*1.18
            thumbJoint[0].position.z = radianValue*2.0
        }
        else if(id === "slider-thumb-joint1"){
            thumbJoint[1].rotation.x = -radianValue
            thumbJoint[1].position.y = radianValue*1.18
            thumbJoint[1].position.z = radianValue*3
        }

        //검지
        else if(id === "slider-index-joint3"){
            fJoint[0].rotation.x = -radianValue
            fJoint[0].position.y = radianValue*1.5
            fJoint[0].position.z = radianValue*6
        }
        else if(id === "slider-index-joint2"){
            fJoint[1].rotation.x = -radianValue
            fJoint[1].position.y = radianValue*1.7
            fJoint[1].position.z = radianValue*8
        }
        else if(id === "slider-index-joint1"){
            fJoint[2].rotation.x = -radianValue
            fJoint[2].position.y = radianValue*2.0
            fJoint[2].position.z = radianValue*9.8
        }

        //중지
        else if(id === "slider-middle-joint3"){
            sJoint[0].rotation.x = -radianValue
            sJoint[0].position.y = radianValue*1.5
            sJoint[0].position.z = radianValue*6
        }
        else if(id === "slider-middle-joint2"){
            sJoint[1].rotation.x = -radianValue
            sJoint[1].position.y = radianValue*1.7
            sJoint[1].position.z = radianValue*8
        }
        else if(id === "slider-middle-joint1"){
            sJoint[2].rotation.x = -radianValue
            sJoint[2].position.y = radianValue*2.0
            sJoint[2].position.z = radianValue*9.8
        }

        //약지
        else if(id === "slider-ring-joint3"){
            tJoint[0].rotation.x = -radianValue
            tJoint[0].position.y = radianValue*1.5
            tJoint[0].position.z = radianValue*6
        }
        else if(id === "slider-ring-joint2"){
            tJoint[1].rotation.x = -radianValue
            tJoint[1].position.y = radianValue*1.7
            tJoint[1].position.z = radianValue*8
        }
        else if(id === "slider-ring-joint1"){
            tJoint[2].rotation.x = -radianValue
            tJoint[2].position.y = radianValue*2.0
            tJoint[2].position.z = radianValue*9.8
        }

        
        //약지
        else if(id === "slider-small-joint3"){
            lJoint[0].rotation.x = -radianValue
            lJoint[0].position.y = radianValue*1.5
            lJoint[0].position.z = radianValue*6
        }
        else if(id === "slider-small-joint2"){
            lJoint[1].rotation.x = -radianValue
            lJoint[1].position.y = radianValue*1.7
            lJoint[1].position.z = radianValue*8
        }
        else if(id === "slider-small-joint1"){
            lJoint[2].rotation.x = -radianValue
            lJoint[2].position.y = radianValue*2.0
            lJoint[2].position.z = radianValue*9.8
        }

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

