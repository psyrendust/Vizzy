vec3 explodeDisplacement() {
  v_Displacement = a_Displacement;
  return a_normals * vec3(a_Displacement * 10.0 * u_Amplitude);
}
