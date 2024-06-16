import {
  Button,
  Card,
  Layout,
  Page,
  Select,
  TextField,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { countries } from "country-data";
import { useState } from "react";
import { useLoaderData } from "@remix-run/react";
import { PlusCircleIcon } from "@shopify/polaris-icons";

export function action() {
  console.log("action");
}

export async function loader() {
  const response = await fetch("http://localhost:3000/areas");
  const areas = await response.json();
  console.log(areas);
  return { areas };
}

export default function DefinedAreas() {
  const loaderData = useLoaderData();

  const options = countries.all.map((country) => {
    return { label: country.name, value: country.alpha2 };
  });

  const emptyArea = { name: "", estimated_time: "" };
  const [areas, setAreas] = useState(loaderData.areas);

  function removeArea(index) {
    if (areas.length === 1) return;
    const newAreas = [...areas];
    newAreas.splice(index, 1);
    setAreas(newAreas);
  }

  function addArea() {
    setAreas([emptyArea, ...areas]);
  }

  return (
    <Page>
      <TitleBar title="Defined Countries" />
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 10,
        }}
      >
        <Button icon={PlusCircleIcon} variat="primary" onClick={addArea}>
          Add Area
        </Button>
      </div>
      <Layout>
        {areas.map((area, index) => {
          const [estimatedTimeStart, estimatedTimeEnd] =
            area.estimated_time?.split("-") ?? [null, null];
          return (
            <Layout.Section key={area.id}>
              <Card title={area.name}>
                <Select
                  label="Country"
                  options={options}
                  value={area.name}
                  onChange={(selected) => {
                    const newAreas = [...areas];
                    newAreas[index] = { ...area, name: selected };
                    setAreas(newAreas);
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginTop: 20,
                  }}
                >
                  <label htmlFor="">Estimated time of delivery</label>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <TextField
                      placeholder="days"
                      type="number"
                      onChange={(val) => {
                        const newAreas = [...areas];
                        newAreas[index] = {
                          ...area,
                          estimated_time: `${val}-${estimatedTimeEnd ?? ""}`,
                        };
                        setAreas(newAreas);
                      }}
                      value={estimatedTimeStart}
                    />
                    <span style={{ margin: "0 4px" }}> - </span>
                    <TextField
                      placeholder="days"
                      type="number"
                      onChange={(val) => {
                        const newAreas = [...areas];
                        newAreas[index] = {
                          ...area,
                          estimated_time: `${estimatedTimeStart ?? ""}-${val}`,
                        };
                        setAreas(newAreas);
                      }}
                      value={estimatedTimeEnd}
                    />
                  </div>
                </div>
                <div
                  style={{
                    justifyContent: "flex-end",
                    display: "flex",
                  }}
                >
                  <Button
                    onClick={() => {
                      removeArea(index);
                    }}
                    tone="critical"
                    variant="primary"
                  >
                    Remove
                  </Button>
                </div>
              </Card>
            </Layout.Section>
          );
        })}
        <Layout.Section>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={() => {
                fetch("http://localhost:3000/save_areas", {
                  method: "POST",
                  body: JSON.stringify({ areas }),
                  headers: {
                    "Content-Type": "application/json",
                  },
                });
              }}
              tone="success"
              variant="primary"
            >
              Save
            </Button>
          </div>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
