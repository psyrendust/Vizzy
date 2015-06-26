vec4(
  clamp(v_Displacement * u_Amplitude * 3.0, 0.0, 1.0),
  clamp(v_Displacement * u_Amplitude * 3.0 - 1.0, 0.0, 1.0),
  clamp(v_Displacement * u_Amplitude * 3.0 - 2.0, 0.0, 1.0),
  1.0
)
