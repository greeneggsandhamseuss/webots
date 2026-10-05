from controller import Robot
import time

robot = Robot()
timestep = int(robot.getBasicTimeStep())

# Wheels
left_wheel = robot.getDevice("wheelL motor")
right_wheel = robot.getDevice("wheelR motor")

# Allow continuous rotation.
left_wheel.setPosition(float("inf"))
right_wheel.setPosition(float("inf"))
left_wheel.setVelocity(0.0)
right_wheel.setVelocity(0.0)

# Sensors: names match your JSON.
distance = robot.getDevice("dist")
gps = robot.getDevice("gps")
imu = robot.getDevice("imu")
lidar = robot.getDevice("lidar")
color = robot.getDevice("color")
left_camera = robot.getDevice("camL")
right_camera = robot.getDevice("camR")

# Enable sensors.
distance.enable(timestep)
gps.enable(timestep)
imu.enable(timestep)
lidar.enable(timestep)
color.enable(timestep)
left_camera.enable(timestep)
right_camera.enable(timestep)

# Added
state = "forward"
waitTime = time.time()

# Repeat while the simulation is running.
while robot.step(timestep) != -1:
    # Read sensors.
    distance_value = distance.getValue()
    position = gps.getValues()
    angles = imu.getRollPitchYaw()
    lidar_values = lidar.getRangeImage()

    # # Read the floor colour: red, green, blue.
    floor_image = color.getImage()
    width = color.getWidth()
    red = color.imageGetRed(floor_image, width, 0, 0)
    green = color.imageGetGreen(floor_image, width, 0, 0)
    blue = color.imageGetBlue(floor_image, width, 0, 0)

    # # Read both camera images.
    left_image = left_camera.getImage()
    right_image = right_camera.getImage()

    # # Show readings in the console.
    # print("Distance:", distance_value)

    
    # print("GPS:", position)
    # print("IMU:", angles)
    # print("LiDAR (first 5 readings):", lidar_values[:5])
    print("Floor RGB:", red, green, blue)

    # Drive forward: same speed for both wheels.
    left_wheel.setVelocity(0)
    right_wheel.setVelocity(0)
    
    if state == "forward":
        if (time.time() - waitTime) > 2.25:
            waitTime = time.time()
            state = "backward"
        else:
            left_wheel.setVelocity(6)
            right_wheel.setVelocity(6)
    elif state == "backward":
        if (time.time() - waitTime) > 2.25:
            left_wheel.setVelocity(0)
            right_wheel.setVelocity(0)
        else:
            left_wheel.setVelocity(-6)
            right_wheel.setVelocity(-6)
