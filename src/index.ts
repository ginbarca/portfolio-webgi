import {
	ViewerApp,
	AssetManagerPlugin,
	GBufferPlugin,
	timeout,
	ProgressivePlugin,
	TonemapPlugin,
	SSRPlugin,
	SSAOPlugin,
	DiamondPlugin,
	FrameFadePlugin,
	GLTFAnimationPlugin,
	GroundPlugin,
	BloomPlugin,
	TemporalAAPlugin,
	AnisotropyPlugin,
	GammaCorrectionPlugin,

	addBasePlugins,
	ITexture, TweakpaneUiPlugin, AssetManagerBasicPopupPlugin, CanvasSnipperPlugin,

	IViewerPlugin,
	HDRiGroundPlugin,
	LightsUiPlugin,
	AmbientLight2,
	DirectionalLight2,
	addRGBELoader,
	DataTextureLoader,
	WebGLRenderer,
	PointLight2,
	SpotLight2,
	CameraUiPlugin,
	PerspectiveCamera,
	Vector3,
	Vector2

	// Color, // Import THREE.js internals
	// Texture, // Import THREE.js internals
} from "webgi";
import "./styles.css";
import "./custom.css";

import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

async function setupViewer() {

	// Initialize the viewer
	const viewer = new ViewerApp({
		canvas: document.getElementById('webgi-canvas') as HTMLCanvasElement,
	})

	// Add some plugins
	const manager = await viewer.addPlugin(AssetManagerPlugin)

	// Add a popup(in HTML) with download progress when any asset is downloading.
	await viewer.addPlugin(AssetManagerBasicPopupPlugin)

	// const hdrManager = await viewer.addPlugin(HDRiGroundPlugin)
	// const groundManager = await viewer.addPlugin(GroundPlugin)

	// Add plugins individually.
	await viewer.addPlugin(GBufferPlugin)
	await viewer.addPlugin(new ProgressivePlugin(32))
	await viewer.addPlugin(new TonemapPlugin(!viewer.useRgbm))
	// await viewer.addPlugin(GammaCorrectionPlugin)
	await viewer.addPlugin(SSRPlugin)
	await viewer.addPlugin(SSAOPlugin)
	// await viewer.addPlugin(DiamondPlugin)
	// await viewer.addPlugin(FrameFadePlugin)
	// await viewer.addPlugin(GLTFAnimationPlugin)
	// await viewer.addPlugin(GroundPlugin)
	// await viewer.addPlugin(BloomPlugin)
	// await viewer.addPlugin(TemporalAAPlugin)
	// await viewer.addPlugin(AnisotropyPlugin)

	// or use this to add all main ones at once.
	// await addBasePlugins(viewer)

	// Add more plugins not available in base, like CanvasSnipperPlugin which has helpers to download an image of the canvas.
	await viewer.addPlugin(LightsUiPlugin)
	await viewer.addPlugin(CameraUiPlugin)

	// Add light
	const scene = viewer.scene;
	let spotLight = new SpotLight2(0xfefefe, 1, 0, 0.6424339472, 0.73);
	spotLight.position.set(1.04, 1.34, 0.67);
	spotLight.rotation.set(0, 0.2, 0);
	// spotLight.castShadow = true;
	let directionalRightLight = new DirectionalLight2(0xde07c5, 1);
	directionalRightLight.rotation.set(0, 1.56, 0);
	let directionalLeftLight = new DirectionalLight2(0x2c7256, 1);
	directionalLeftLight.rotation.set(0, 4.46, 0);
	await scene.addLight(spotLight);
	await scene.addLight(directionalRightLight);
	await scene.addLight(directionalLeftLight);
	let displayLight = new SpotLight2(0xfefefe, 1, 0, 0.3384126984, 0.47);
	displayLight.position.set(-0.1, 2.12, 0.15);
	displayLight.rotation.set(-1.64, 0, 0);
	displayLight.castShadow = true;
	await scene.addLight(displayLight);

	// Config camera
	// const cameraObj = new PerspectiveCamera();
	// scene.activeCamera = viewer.createCamera(cameraObj);
	// await scene.activeCamera.position.set(-0.1, 1.58, 2.38);
	// await scene.activeCamera.positionUpdated();
	// await scene.activeCamera.target.set(-0.18, 0.58, -0.10);
	// await scene.activeCamera.targetUpdated();
	const options = await scene.activeCamera.getCameraOptions();
	options.zoom = 0.5;
	options.position = [-0.1, 1.58, 2.38];
	options.target = [-0.18, 0.58, -0.10];
	viewer.scene.activeCamera.setCameraOptions(options);
	const windowHalf = new Vector2( window.innerWidth / 2, window.innerHeight / 2 );
	const mouse = new Vector2();

	function onMouseMove(event: any) {
		mouse.x = ( event.clientX - windowHalf.x );
		mouse.y = ( event.clientY - windowHalf.y );
	}
	await document.addEventListener( 'mousemove', onMouseMove, false );
	// await scene.activeCamera.positionTargetUpdated();

	// This must be called once after all plugins are added.
	viewer.renderer.refreshPipeline()

	await manager.addFromPath("./assets/scene.glb");

	// Load an environment map if not set in the glb file
	await scene.setEnvironment(await manager.importer!.importSinglePath<ITexture>('./assets/evening_meadow_1k.hdr', { generateMipmaps: false }));

	// Add some UI for tweak and testing.
	const uiPlugin = await viewer.addPlugin(TweakpaneUiPlugin)
	// Add plugins to the UI to see their settings.
	uiPlugin.setupPlugins<IViewerPlugin>(TonemapPlugin, LightsUiPlugin, CameraUiPlugin)

}

setupViewer()
