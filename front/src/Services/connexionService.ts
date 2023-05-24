import { serverAdress } from "./utils";

export async function imagePublic() {
  const response = await fetch(`${serverAdress}images`);
  const monImage = response.json();
  return monImage;
}

export async function imageByUser() {
  const url = `${serverAdress}imagesUser`;
  const token = localStorage.getItem("tokenSite");

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const responseData = await response.json();
  return responseData;
}

export async function changeVisibilityImage(id: string | undefined) {
  const url = `${serverAdress}images/${id}`;
  const token = localStorage.getItem("tokenSite");

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const responseData = await response.json();
  return responseData;
}

export async function getOneImage(slug: string) {
  const token = localStorage.getItem("tokenSite");
  const response = await fetch(`${serverAdress}image/${slug}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const monImage = response.json();
  return monImage;
}
