import React, { useEffect, useState } from 'react';
import HumanPose from 'react-native-human-pose';
import { View, Text } from 'react-native';

export const Dumbellsensor = () => {
  const [noOfCurls, setNoOfCurls] = useState(0);
  const [hasStart, setHasStart] = useState(false);
  const [hasEnd, setHasEnd] = useState(false);

  const calculateAngle = (joint1, joint2, joint3) => {
    const radians = Math.atan2(joint3.y - joint2.y, joint3.x - joint2.x) - Math.atan2(joint1.y - joint2.y, joint1.x - joint2.x);
    let angle = Math.abs((radians * 180.0) / Math.PI);

    // Ensure angle is within 0 to 360 degrees
    if (angle > 180) {
      angle = 360 - angle;
    }

    return angle;
  };

  const onPoseDetected = (pose) => {
    const leftShoulder = pose[0]?.pose?.leftShoulder;
    const leftElbow = pose[0]?.pose?.leftElbow;
    const leftWrist = pose[0]?.pose?.leftWrist;

    const rightShoulder = pose[0]?.pose?.rightShoulder;
    const rightElbow = pose[0]?.pose?.rightElbow;
    const rightWrist = pose[0]?.pose?.rightWrist;

    const minConfidence = 0.5; // Adjust the confidence level as needed

    if (
      leftShoulder?.confidence > minConfidence &&
      leftElbow?.confidence > minConfidence &&
      leftWrist?.confidence > minConfidence &&
      rightShoulder?.confidence > minConfidence &&
      rightElbow?.confidence > minConfidence &&
      rightWrist?.confidence > minConfidence
    ) {
      const leftElbowWristAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
      const rightElbowWristAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);

      if (leftElbowWristAngle < 90 && rightElbowWristAngle < 90) {
        // Adjust the threshold angle as needed
        setHasStart(true);
        setHasEnd(false);
      }

      if (hasStart && (leftElbowWristAngle > 160 || rightElbowWristAngle > 160)) {
        // Adjust the threshold angle as needed
        setHasEnd(true);
        setHasStart(false);
      }
    }
  };

  useEffect(() => {
    setNoOfCurls(hasEnd ? noOfCurls + 1 : noOfCurls);
  }, [hasEnd]);

  return (
    <View style={{ flex: 1 }}>
      <Text>Human Pose</Text>
      <HumanPose
        height={500}
        width={400}
        enableKeyPoints={true}
        enableSkeleton={true}
        flipHorizontal={false}
        isBackCamera={false}
        color={'255, 0, 0'}
        mode={'single'} // Set mode to 'single'
        onPoseDetected={onPoseDetected}
      />
      <Text
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          textAlign: 'center',
          textShadowColor: 'black',
          backgroundColor: 'white',
          padding: 10,
          fontSize: 20,
        }}>
        No of Barbell Curls: {noOfCurls}
      </Text>
    </View>
  );
};

export default Dumbellsensor;
