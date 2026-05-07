import Spline from '@splinetool/react-spline/next';

export default function Home() {
  return (
    <main>
      <Spline
        scene="https://prod.spline.design/A7En-21feH6YHJ0f/scene.splinecode"
      // onLoad={(spline) => {
      //   // spline.setZoom?.(1);
      // }}
      />
    </main>
  );
}
