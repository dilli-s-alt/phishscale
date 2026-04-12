export const renderTemplate = (template, data, trackingId) => {
  let html = template;

  const replacements = {
    first_name: data.first_name || "",
    last_name: data.last_name || "",
    email: data.email || "",
    department: data.department || "",
    organization_name: data.organization_name || "Your Organization"
  };

  html = html.replace(/{{\s*(first_name|last_name|email|department|organization_name)\s*}}/g, (_, key) => {
    return replacements[key] || "";
  });

  // Replace links
  html = html.replace(
    /href="(.*?)"/g,
    `href="${process.env.BASE_URL}/api/track/click/${trackingId}"`
  );

  // Add tracking pixel
  html += `<img src="${process.env.BASE_URL}/api/track/open/${trackingId}" width="1" height="1" alt="" style="display:none;" />`;

  return html;
};
