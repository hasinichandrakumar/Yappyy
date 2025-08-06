export class KalmanFilter {
  private R: number; // Measurement noise
  private Q: number; // Process noise
  private A: number; // State transition
  private C: number; // Measurement
  private cov: number;
  private x: number;

  constructor(R = 0.1, Q = 0.1, A = 1, C = 1) {
    this.R = R; // Measurement noise
    this.Q = Q; // Process noise
    this.A = A; // State transition
    this.C = C; // Measurement
    this.cov = NaN;
    this.x = NaN; // Estimated value
  }

  public filter(measurement: number): number {
    // Initialize state estimate and covariance if undefined
    if (isNaN(this.x)) {
      this.x = measurement / this.C;
      this.cov = 1;
    }

    // Prediction step
    const predX = this.A * this.x;
    const predCov = this.A * this.A * this.cov + this.Q;

    // Measurement update step
    const K = predCov * this.C / (this.C * predCov * this.C + this.R);
    this.x = predX + K * (measurement - this.C * predX);
    this.cov = predCov - K * this.C * predCov;

    return this.x;
  }

  public reset() {
    this.cov = NaN;
    this.x = NaN;
  }
}