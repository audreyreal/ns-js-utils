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
type ApplyToWorldAssemblyFormData =
  | {
      action: "join_UN";
      submit: "1";
    }
  | {
      action: "join_UN";
      resend: "1";
    };