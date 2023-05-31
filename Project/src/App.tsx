import Banner from "./components/Banner";
import Card from "./components/Card";

function App () {

  return (
    <>
      <Banner title="test" tailwind_class={""} onclick={function (): void {
              throw new Error("Function not implemented.");
          } }/>
      <div className=" justify-center items-center grid grid-cols-4 gap-4">
        <Card />
      </div>
    </>
  )
}
export default  App;
