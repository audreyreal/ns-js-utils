/**
 * Type representing the formdata for moving to a region.
 */
type MoveRegionFormData = {
    region_name: string;
    password?: string;
    move_region: "1";
};

/**
 * Type representing the formdata for applying to the World Assembly.
 */
type ApplyToWorldAssemblyFormData = {
  action: "join_UN";
} & (
  | { submit: "1"; resend?: never } // Exactly `submit`, no `resend`
  | { resend: "1"; submit?: never } // Exactly `resend`, no `submit`
);